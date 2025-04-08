// Fetch All Campaigns
export const getCampaigns = async () => {
    const response = await fetch('http://localhost:5000/api/campaigns');
    return await response.json();
  };
  
  // User Login
  export const loginUser = async (email, password) => {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await response.json();
  };