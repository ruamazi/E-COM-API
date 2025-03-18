import Newsletter from "../models/Newsletter.js";

export const subscribe = async (req, res) => {
 const { email } = req.body;
 if (!email) {
  return res.status(400).json({ error: "Email is required" });
 }
 try {
  const subscriber = await Newsletter.findOne({ email }).exec();
  if (subscriber) {
   return res.status(400).json({ error: "Email already subscribed" });
  }
  const newSubscriber = await Newsletter.create({ email });
  await newSubscriber.save();
  res.status(200).json({ message: "Subscribed successfully to newsletter" });
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: "Failed to subscribe" });
 }
};
