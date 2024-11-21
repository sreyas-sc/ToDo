// Now the authService is responsible for handling all login-related API requests. 
// The Login component no longer needs to deal with Axios directly.
import axios from 'axios';

interface AuthService {
  login(email: string, password: string): Promise<{ token: string; userId: string }>;
}

class AxiosAuthService implements AuthService {
  async login(email: string, password: string): Promise<{ token: string; userId: string }> {
    const response = await axios.post('http://localhost:5000/auth/login', {
      email,
      password,
    });
    return {
      token: response.data.token,
      userId: response.data.userId,
    };
  }
}

const authService = new AxiosAuthService();
export default authService;
