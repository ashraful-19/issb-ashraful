const mongoose = require('mongoose');


    const paymentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'MilitaryCourse', required: true },
    amount: { type: Number, required: true },
    paymentDate: {
      type: Date,
      default: Date.now
    },
    validityDate: {
      type: Date,
      required: true,
      default: function() {
        // Set the validity date to 6 months from the payment date
        return new Date(Date.now() + (6 * 30 * 24 * 60 * 60 * 1000)); // 6 months * 30 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
      }
    },
    paymentMethod: { type: String, required: true },
    status: { type: String, required: true },
    transactionId: { type: String, required: true },
  });
  
  
  const Payment = mongoose.model('Payment', paymentSchema);
  
  module.exports = {
  Payment,
  };
  