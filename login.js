const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    const { token, user } = await loginUser(email, password);
    localStorage.setItem('token', token); // Store JWT
    navigate('/dashboard');
  };