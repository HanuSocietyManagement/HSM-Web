$.ajaxSetup({
    headers: {
        'Authorization': 'Bearer ' + Cookies.get('__session')
    }
});

const url = backendUrl + "/invoice/";

const loadData = function(filter){
    return $.ajax({
        type: "GET",
        url: url,
        data: filter
    });
};

const insertItem = function(item){
    return $.ajax({
        type: "POST",
        url: url,
        data: item
    });
};

const updateItem = function(item){
    return $.ajax({
        type: "PUT",
        url: url,
        data: item
    });
};

const deleteItem = function(item){
    return $.ajax({
        type: "DELETE",
        url: url,
        data: item
    });
};


$("#expenseTable").jsGrid({
    width: "100%",
    height: "400px",

    autoload: true,
    inserting: true,
    editing: true,
    sorting: true,
    paging: true,

    //data: clients,
    controller: {
        loadData: loadData,
        insertItem: insertItem,
        updateItem: updateItem,
        deleteItem: deleteItem
    },

    fields: [
        { name: "documentNo", type: "number", width: 50 },
        { name: "invoiceDate", type: "text", width: 150, validate: "required" },
        { name: "description", type: "text", width: 150, validate: "required" },
        { name: "amount", type: "number", width: 50 },
        { name: "paymentStatus", type: "text", width: 200 },
        { type: "control" }
    ]
});