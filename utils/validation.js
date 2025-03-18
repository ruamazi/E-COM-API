export function validateRegistration(name, email, password) {
 if (!name || !email || !password) {
  return "Missing required fields";
 }
 if (name.length < 3 || name.length > 20) {
  return "Name must be between 3 and 20 characters";
 }
 if (name.includes(" ")) {
  return "Name cannot contain spaces";
 }
 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 if (!emailRegex.test(email)) {
  return "Invalid email format";
 }
 if (password.length < 6 || password.length > 20) {
  return "Password must be between 6 and 20 characters";
 }
 const hasUpperCase = /[A-Z]/.test(password);
 const hasLowerCase = /[a-z]/.test(password);
 const hasNumber = /[0-9]/.test(password);
 const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
 if (!(hasUpperCase && hasLowerCase && hasNumber && hasSpecial)) {
  return "Password must include uppercase, lowercase, number, and special character";
 }

 return null; // No errors
}
