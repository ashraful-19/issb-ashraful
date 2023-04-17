
const {Otp,User} = require("../models/userModel");

const {Payment} = require("../models/paymentModel");
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
      
      

      const checkPayment = async (req, res, next) => {
        try {
          const userId = req.user._id;
          const courseId = req.params.id;
          console.log(userId, courseId);
      
          const payment = await Payment.findOne({ user: userId, course_id: courseId });
          console.log(payment);
      
          if (!payment || !payment.is_active) {
          
            return next();
          }
      
          
      
          // Payment found and active, allow to next middleware/controller
          res.redirect(`/course-lecture/${courseId}`);
        } catch (error) {
          console.error(error);
          res.status(500).send('Error checking payment');
        }
      };

      const checkAccess = async (req, res, next) => {
        try {
          const userId = req.user._id;
          const courseId = req.params.id;
          console.log(userId, courseId);
      
          const payment = await Payment.findOne({ user: userId, course_id: courseId });
          console.log(payment);
      
          if (payment || payment.is_active) {
          
            return next();
          }
         
      
          // Payment found and active, allow to next middleware/controller
          res.redirect(`/course-details/${courseId}`);
        } catch (error) {
          console.error(error);
          res.status(500).send('Error checking payment');
        }
      };

      
    module.exports={
        updateUser,
        checkPayment,
        checkAccess,
    }