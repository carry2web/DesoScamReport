export const Profile = ({ profile, rawParam, isLoading, isError, error }) => {
  if (isLoading) return <p>Loading profile...</p>;

  if (isError) {
    return (
      <>
        <h2>Error loading profile</h2>
        <p style={{ color: 'red' }}>{error.message}</p>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <h1>Profile not found</h1>
        <p style={{ color: 'gray' }}>
          No profile found for <strong>{rawParam}</strong>.
        </p>
      </>
    );
  }

  return (
    <>
      <h1>@{profile.Username}</h1>
      <p>Public Key: {profile.PublicKeyBase58Check}</p>
      <p>{profile.Description || 'No bio available.'}</p>
    </>
  );
};
