const mongoose=require('mongoose');

const DeliveryAssessmentSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
      },
      order_id: {
        type: String,
        unique: true,
        sparse: true,
      },
      assignment_data_and_time: {
        type: String,
        required: true,
        unique: true,
      },
      delivery_date_time: {
            type: Date, 
            required: true,
          },
         Complection_data_time: {
            type: Date,
            default: Date.now,
          },
      feedback:
      {
        type:String, 
        required: true,
      }
    }, { timestamps: true }); 
    module.exports =  mongoose.model("DeliveryAssessment",DeliveryAssessmentSchema );