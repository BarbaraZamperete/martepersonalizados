const app = require('./server');
require('dotenv').config();
require('./models/db')


//escuta a porta setada em port
app.listen(process.env.PORT || 3000, () => {
    console.log('Server conected');
})