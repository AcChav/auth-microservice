const authService = require("../services/authService");
const userRepository = require("../repositories/userRepository");

class AuthController {
  async register(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const user = await authService.register(email, password);
      return res
        .status(201)
        .json({ message: "User registered successfully", user });
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const data = await authService.login(email, password);
      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await userRepository.findById(req.user.sub);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json({ user });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
