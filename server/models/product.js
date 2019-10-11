var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productSchema = new Schema({
    name: { type: String, required: [true, 'Name is mandatory'] },
    price: { type: Number, required: [true, 'Price is mandatory'] },
    description: { type: String, required: false },
    enable: { type: Boolean, required: true, default: true },
    img: { type: String, required: false },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});


module.exports = mongoose.model('Product', productSchema);