$(document).ready(function () {
    const ContractAddress = '0xb93EFAbB6C9d643D123ad093098394FdB4c7EfE3';
    // const ContractABI = $.getScript("/js/contractabi.json");

    const ContractABI = 
[
	{
		"constant": false,
		"inputs": [
			{
				"name": "_initNumber",
				"type": "uint256"
			},
			{
				"name": "_firstString",
				"type": "string"
			}
		],
		"name": "addProStru",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "killContract",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getAllproducts",
		"outputs": [
			{
				"components": [
					{
						"name": "number",
						"type": "uint256"
					},
					{
						"name": "productName",
						"type": "string"
					},
					{
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"name": "",
				"type": "tuple[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getNumOfProducts",
		"outputs": [
			{
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "getProductStruct",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			},
			{
				"name": "",
				"type": "string"
			},
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "productes",
		"outputs": [
			{
				"name": "number",
				"type": "uint256"
			},
			{
				"name": "productName",
				"type": "string"
			},
			{
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]
   //-----------------------------------추가
    $('#linkHome').click(function () { showView("viewHome") });
    $('#linkSubmitItem').click(function () { showView("viewSubmitItem"); getListAll(); });
	$('#linkcarlist').click(function () { showView("viewcarlist"); getListAll(); });
    $('#itemUploadButton').click(uploadItem);

    $('#account').val(ContractAddress);
	  $('#account1').val(ContractAddress);
    $('#contractLink').text(ContractAddress);
    $('#contractLink').attr('href', 'https://ropsten.etherscan.io/address/' + ContractAddress);

    // Attach AJAX "loading" event listener
    $(document).on({
        ajaxStart: function () { $("#loadingBox").show() },
        ajaxStop: function () { $("#loadingBox").hide() }
    });

    function showView(viewName) {
        // Hide all views and show the selected view only
        $('main > section').hide();
        $('#' + viewName).show();
    }

    function showInfo(message) {
        $('#infoBox>p').html(message);
        $('#infoBox').show();
        $('#infoBox>header').click(function () { $('#infoBox').hide(); });
    }

    function showError(errorMsg) {
        $('#errorBox>p').html("Error: " + errorMsg);
        $('#errorBox').show();
        $('#errorBox>header').click(function () { $('#errorBox').hide(); });
    }

    function getListAll() {
        $("#table1 tr").remove();
        // Send the form data using post
        $.get("/listall", function (data) {
            console.log('data.getLists : ', data.getLists);
            let productList = data.getLists;
            let table = document.getElementById("table1");
            for (let i = 0; i < productList.length; i++) {
                let cnt = productList.length - 1 - i;
                let product = productList[cnt];
                processTable(product)
            }  // end of for
        });  // end of post
    }  // end of getListAll

    function processTable(getProduct) {
        let table = document.getElementById("table1");
        let toString = getProduct.toString();
        console.log("getProduct: " + getProduct);
        console.log("processTable: " + toString);
        let strArray = toString.split(",");
        let timestamp = new Date(strArray[3] * 1000);
        //console.log("timestamp: " + timestamp);
        //console.log("strArray: " + strArray[3] * 1000);

        let row = table.insertRow();
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        
        let cell3 = row.insertCell(3);
        cell1.innerHTML = strArray[0];
        cell2.innerHTML = strArray[1];
        
        cell3.style.width = "60%";
        cell3.innerHTML = timestamp;
    }

    async function uploadItem() {
        console.log("uploadItem: ");

        let number = $("#pronumber").val();
        let name = $("#proname").val();
       

        console.log("number: " + number);
        console.log("name: " + name);


        if (window.ethereum)
            try {
                await window.ethereum.enable();
                showInfo('ethereum.enable');
            } catch (err) {
                return showError("Access to your Ethereum account rejected.");
            }

        if (typeof web3 === 'undefined')
            return showError("Please install MetaMask to access the Ethereum Web3 injected API from your Web browser.");

        let contract = web3.eth.contract(ContractABI).at(ContractAddress);

        contract.addProStru(number, name, function (err, result) {
            // contract.add(documentHash, function (err, result) {
            if (err)
                return showError("Smart contract call failed: " + err);
            showInfo(`Document ${result} <b>successfully added</b> to the registry.`);
        });

        getListAll();
    }


});

