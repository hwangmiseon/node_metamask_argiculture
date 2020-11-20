const bodyParser = require('body-parser')
const Tx = require('ethereumjs-tx').Transaction
const Web3 = require('web3')
const abi = require('../public/js/contractabi.json')
const web3 = new Web3('https://ropsten.infura.io/v3/3c52917848e945229c0d33d632b10490')

const contractAddress = '0xb93EFAbB6C9d643D123ad093098394FdB4c7EfE3'
const contract = new web3.eth.Contract(abi, contractAddress)

module.exports = function (app) {
   app.get('/', function (req, res) {
      res.render('index.html')
   });
   app.get('/about', function (req, res) {
      res.render('about.html');
   });

   app.get('/listall', function (req, res) {
      //res.render('about.html');
      console.log('listall...');
      // const getNumber = req.body.getNumber;
      contract.methods.getAllproducts().call()
         .then(productes => {
            console.log(" Value productes: " + productes)
            var response = {
               'result': 'true',
               'getLists': productes
            }

            console.log('response : ' + response);
            res.status(200).json(response);
         });  // end of .then
   });  // end of app.post


}
