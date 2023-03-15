
const {Otp,User} = require("../models/userModel");
// const updateUser = async (req, res) => {
//     try {
//       const phone = req.user.phone;

// // Find the user object by phone number and update the fields
// const result = await User.findOneAndUpdate(
// { phone: phone },
// { $set: {
//   name: req.body.name,
//   institution: req.body.institution,
//   course: req.body.course,
//   email: req.body.email
// }
// },
// { new: true }
// );

// if (result) {
// res.status(200).json({ message: 'User data updated successfully' });
// } else {
// res.status(404).json({ error: 'User not found' });
// }
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }};        

const updateUser = async (req, res,next) => {
    try {
        const phone = req.user.phone;
        console.log(phone)
        const user = await User.findOne({ phone });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        if (!user.name) {
          return res.redirect('/auth/update-profile');
        }
        next();
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
      }};        

    module.exports={
        updateUser,
    }