const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust path as necessary

// Connect to MongoDB
mongoose.connect('mongodb+srv://i222560:i2232930!@cluster0.64dmh.mongodb.net/movieDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Delete user by email
async function deleteUserByEmail(email) {
  try {
    const result = await User.deleteOne({ email });
    console.log('User deleted:', result);
  } catch (error) {
    console.error('Error deleting user:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the function
deleteUserByEmail('testuser@example.com');
