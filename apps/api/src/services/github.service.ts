export const exchangeCodeForToken = async (code: string): Promise<string | null> => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json', // Force GitHub to return JSON, not a form-encoded string
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const data = await response.json();
    return data.access_token || null;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return null;
  }
};

export const fetchGithubUser = async (token: string) => {
  try {
    // 1. Fetch public profile (to get username)
    const profileRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    const profile = await profileRes.json();

    // 2. Fetch emails (because the public profile might not have the email if it's hidden)
    const emailsRes = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    const emails = await emailsRes.json();

    // Find the primary email
    const primaryEmailObj = emails.find((e: any) => e.primary === true);
    const primaryEmail = primaryEmailObj ? primaryEmailObj.email : emails[0].email;

    return {
      username: profile.login,
      email: primaryEmail,
    };
  } catch (error) {
    console.error('Error fetching GitHub user:', error);
    return null;
  }
};
