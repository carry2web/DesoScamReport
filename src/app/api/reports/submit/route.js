import { NextResponse } from 'next/server'
import { DESO_API_BASE } from '@/config/desoConfig'

// Helper function to make DeSo API calls
async function desoApiCall(endpoint, body) {
  const response = await fetch(`${DESO_API_BASE}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  
  if (!response.ok) {
    throw new Error(`DeSo API call failed: ${response.statusText}`)
  }
  
  return response.json()
}

// Create a structured report post that can be parsed later
function createReportPostBody(reportData) {
  const categoryEmojis = {
    'CRITICAL': '🔴',
    'HIGH': '🟠', 
    'MEDIUM': '🟡',
    'LOW': '🔵'
  }
  
  const urgentFlag = reportData.urgentReport ? '🚨 URGENT ALERT 🚨\n\n' : ''
  const categoryEmoji = categoryEmojis[reportData.category] || '⚠️'
  
  let postBody = `${urgentFlag}${categoryEmoji} SCAMMER REPORT #DeSoSCAMReport\n\n`
  
  // Report details
  postBody += `📋 REPORT DETAILS:\n`
  if (reportData.reportedUsername) {
    postBody += `👤 Username: ${reportData.reportedUsername}\n`
  }
  if (reportData.reportedPublicKey) {
    postBody += `🔑 Public Key: ${reportData.reportedPublicKey.substring(0, 20)}...\n`
  }
  postBody += `🏷️ Category: ${reportData.category}\n`
  postBody += `⏰ Reported: ${new Date().toLocaleString()}\n\n`
  
  // Description
  postBody += `📝 INCIDENT DESCRIPTION:\n${reportData.description}\n\n`
  
  // Evidence
  if (reportData.evidenceUrls && reportData.evidenceUrls.filter(url => url.trim()).length > 0) {
    postBody += `🔗 EVIDENCE:\n`
    reportData.evidenceUrls.filter(url => url.trim()).forEach((url, index) => {
      postBody += `${index + 1}. ${url}\n`
    })
    postBody += `\n`
  }
  
  // Reporter info
  if (reportData.reporterUsername) {
    postBody += `📤 Reported by: @${reportData.reporterUsername}\n`
  }
  
  // Warning footer
  postBody += `\n⚠️ COMMUNITY WARNING ⚠️\n`
  postBody += `This report is under investigation. Use caution when interacting with the reported account.\n\n`
  postBody += `#ScamAlert #DeSoSafety #CommunityProtection`
  
  // Structured data for parsing (in a comment-like format)
  postBody += `\n\n<!-- REPORT_DATA: ${JSON.stringify({
    id: Date.now(),
    reportedUsername: reportData.reportedUsername,
    reportedPublicKey: reportData.reportedPublicKey,
    category: reportData.category,
    urgent: reportData.urgentReport,
    reporterPubKey: reportData.reporterPublicKey,
    reporterUsername: reportData.reporterUsername,
    timestamp: new Date().toISOString()
  })} -->`
  
  return postBody
}

export async function POST(request) {
  try {
    const reportData = await request.json()
    
    // Validate required fields
    if (!reportData.reportedUsername && !reportData.reportedPublicKey) {
      return NextResponse.json(
        { error: 'Either username or public key is required' },
        { status: 400 }
      )
    }
    
    if (!reportData.category) {
      return NextResponse.json(
        { error: 'Scam category is required' },
        { status: 400 }
      )
    }
    
    if (!reportData.description || reportData.description.trim().length < 10) {
      return NextResponse.json(
        { error: 'Description must be at least 10 characters' },
        { status: 400 }
      )
    }
    
    if (!reportData.reporterPublicKey) {
      return NextResponse.json(
        { error: 'Reporter authentication required' },
        { status: 401 }
      )
    }
    
    // Create the report post body
    const postBody = createReportPostBody(reportData)
    
    // Submit the report as a DeSo post
    const submitPostResponse = await desoApiCall('submit-post', {
      UpdaterPublicKeyBase58Check: reportData.reporterPublicKey,
      PostBody: postBody,
      MinFeeRateNanosPerKB: 1000, // Standard fee
      InTutorial: false
    })
    
    if (!submitPostResponse || submitPostResponse.error) {
      throw new Error(submitPostResponse?.error || 'Failed to submit post to DeSo')
    }
    
    // Log for development
    console.log('📋 Scammer Report Posted to DeSo:', {
      postHashHex: submitPostResponse.PostHashHex,
      reporter: reportData.reporterUsername || 'Anonymous',
      target: reportData.reportedUsername || reportData.reportedPublicKey,
      category: reportData.category,
      urgent: reportData.urgentReport
    })
    
    return NextResponse.json({
      success: true,
      report: {
        postHashHex: submitPostResponse.PostHashHex,
        category: reportData.category,
        submittedAt: new Date().toISOString(),
        priority: reportData.urgentReport ? 'HIGH' : 'NORMAL'
      },
      message: 'Report submitted successfully to DeSo blockchain. Community has been notified.',
      desoPostUrl: `https://diamondapp.com/posts/${submitPostResponse.PostHashHex}`
    })
    
  } catch (error) {
    console.error('Error submitting report to DeSo:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to submit report. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  try {
    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    const urgent = url.searchParams.get('urgent')
    const limit = parseInt(url.searchParams.get('limit')) || 50
    
    // Search for scammer reports on DeSo using hashtag #DeSoSCAMReport
    const searchResponse = await desoApiCall('get-posts-stateless', {
      PostContent: '#DeSoSCAMReport',
      NumToFetch: limit,
      MediaRequired: false,
      PostsByDESO: false
    })
    
    if (!searchResponse || !searchResponse.PostsFound) {
      return NextResponse.json({
        success: true,
        reports: [],
        total: 0,
        message: 'No scammer reports found'
      })
    }
    
    // Parse and filter reports from DeSo posts
    let reports = []
    
    for (const post of searchResponse.PostsFound) {
      try {
        // Look for structured data in the post body
        const reportDataMatch = post.PostBody?.match(/<!-- REPORT_DATA: (.*?) -->/)
        if (reportDataMatch) {
          const reportData = JSON.parse(reportDataMatch[1])
          
          // Apply filters
          if (category && reportData.category !== category) continue
          if (urgent === 'true' && !reportData.urgent) continue
          if (urgent === 'false' && reportData.urgent) continue
          
          reports.push({
            id: reportData.id,
            postHashHex: post.PostHashHex,
            reportedUsername: reportData.reportedUsername,
            reportedPublicKey: reportData.reportedPublicKey,
            category: reportData.category,
            urgent: reportData.urgent,
            reporterUsername: reportData.reporterUsername,
            reporterPublicKey: reportData.reporterPubKey,
            submittedAt: reportData.timestamp,
            postBody: post.PostBody,
            likes: post.LikeCount || 0,
            reposts: post.RepostCount || 0,
            comments: post.CommentCount || 0,
            diamonds: post.DiamondCount || 0,
            desoPostUrl: `https://diamondapp.com/posts/${post.PostHashHex}`,
            status: 'PENDING' // In the future, could track investigation status
          })
        }
      } catch (parseError) {
        console.error('Error parsing report post:', parseError)
        // Skip posts that can't be parsed
        continue
      }
    }
    
    // Sort by most recent first
    reports.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    
    return NextResponse.json({
      success: true,
      reports: reports,
      total: reports.length,
      message: `Found ${reports.length} scammer reports`
    })
    
  } catch (error) {
    console.error('Error fetching reports from DeSo:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports from DeSo blockchain' },
      { status: 500 }
    )
  }
}
