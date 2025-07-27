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

export async function GET(request) {
  try {
    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    const urgent = url.searchParams.get('urgent')
    const limit = parseInt(url.searchParams.get('limit')) || 100
    
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
        stats: {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
          urgent: 0,
          total: 0
        }
      })
    }
    
    // Parse and filter reports from DeSo posts
    let reports = []
    let stats = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      urgent: 0,
      total: 0
    }
    
    for (const post of searchResponse.PostsFound) {
      try {
        // Look for structured data in the post body
        const reportDataMatch = post.PostBody?.match(/<!-- REPORT_DATA: (.*?) -->/)
        if (reportDataMatch) {
          const reportData = JSON.parse(reportDataMatch[1])
          
          // Update stats
          stats.total++
          if (reportData.urgent) stats.urgent++
          
          switch (reportData.category) {
            case 'CRITICAL':
              stats.critical++
              break
            case 'HIGH':
              stats.high++
              break
            case 'MEDIUM':
              stats.medium++
              break
            case 'LOW':
              stats.low++
              break
          }
          
          // Apply filters
          if (category && reportData.category !== category) continue
          if (urgent === 'true' && !reportData.urgent) continue
          if (urgent === 'false' && reportData.urgent) continue
          
          // Extract description from post body
          const descriptionMatch = post.PostBody?.match(/📝 INCIDENT DESCRIPTION:\n(.*?)\n\n/s)
          const description = descriptionMatch ? descriptionMatch[1].trim() : ''
          
          // Extract evidence URLs
          const evidenceMatch = post.PostBody?.match(/🔗 EVIDENCE:\n(.*?)\n\n/s)
          const evidenceUrls = evidenceMatch 
            ? evidenceMatch[1].split('\n').map(line => line.replace(/^\d+\.\s*/, '')).filter(url => url.trim())
            : []
          
          reports.push({
            id: reportData.id,
            postHashHex: post.PostHashHex,
            reportedUsername: reportData.reportedUsername,
            reportedPublicKey: reportData.reportedPublicKey,
            category: reportData.category,
            urgent: reportData.urgent,
            description: description,
            evidenceUrls: evidenceUrls,
            reporterUsername: reportData.reporterUsername,
            reporterPublicKey: reportData.reporterPubKey,
            submittedAt: reportData.timestamp,
            postBody: post.PostBody,
            profilePic: post.ProfileEntryResponse?.ProfilePic || '/default-avatar.png',
            likes: post.LikeCount || 0,
            reposts: post.RepostCount || 0,
            comments: post.CommentCount || 0,
            diamonds: post.DiamondCount || 0,
            desoPostUrl: `https://diamondapp.com/posts/${post.PostHashHex}`,
            status: 'PENDING' // Could be enhanced to track investigation status
          })
        }
      } catch (parseError) {
        console.error('Error parsing report post:', parseError)
        continue
      }
    }
    
    // Sort by most recent first
    reports.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    
    return NextResponse.json({
      success: true,
      reports: reports,
      total: reports.length,
      stats: stats,
      message: `Found ${reports.length} scammer reports from DeSo blockchain`
    })
    
  } catch (error) {
    console.error('Error fetching reports from DeSo:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports from DeSo blockchain' },
      { status: 500 }
    )
  }
}
