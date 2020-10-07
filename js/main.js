let saleData = [];
let page = 1;
const perPage = 10;
const saleTableTemplate = _.template(
    `<%_.forEach(saleData, function(sales) { %>
        <tr data-id=<%- sales._id %>>
            <td><%- sales.customer.email %></td>
            <td><%- sales.storeLocation %></td>
            <td><%- sales.items.length %></td>
            <td><%- moment.utc(sales.saleDate).local().format("LLLL") %></td>
        </tr>
    <% }); %>`
);
const saleModelBodyTemplate = _.template(
    `<h4>Customer</h4>
    <strong>email:</strong><%- obj.customer.email %><br>
    <strong>age:</strong><%- obj.customer.age %><br>
    <strong>satisfaction:</strong><%- obj.customer.satisfaction %>/5
    <br><br>
    <h4>Items: $<%- obj.total.toFixed(2) %></h4>
    <table class="table">
        <thead>
            <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
            </tr>
        </thead>
        <tbody>
            <%_.forEach(obj.items, function(sale) { %>
                <tr data-id=<%- sale._id %>>
                    <td><%- sale.name %></td>
                    <td><%- sale.quantity %></td>
                    <td><%- sale.price %></td>
                </tr>
            <% }); %>
        </tbody>
    </table>`
);

function loadSaleData() {
    fetch(`https://still-gorge-63646.herokuapp.com/api/sales?page=${page}&perPage=${perPage}`)
        .then((response) => {
            return response.json();
        }).then((jsonData) => {
            saleData = jsonData;
            let dataRows = saleTableTemplate({saleData});
            $("#sale-table tbody").html(dataRows);
            $("#current-page").html(page);
        });
};

$(function() {
    loadSaleData();
});

$(function() {
    $("#sale-table tbody").on("click", "tr", function(e) {
        let clickedId = $(this).attr("data-id");
        let clickedSale = saleData.find(({_id}) => _id == clickedId);
        console.log(clickedSale._id);
        console.log(clickedSale.customer.email);

        clickedSale.total = 0;

        for (let n = 0; n < clickedSale.items.length; n++) {
            clickedSale.total = clickedSale.total + (clickedSale.items[n].price * clickedSale.items[n].quantity);
            console.log(clickedSale.items[n].name);
            console.log(clickedSale.items[n].price);
            console.log(clickedSale.total);
        }

        $("#sale-modal h4").html(`Sale: ${clickedSale._id}`);
        $(".modal-body").html(saleModelBodyTemplate(clickedSale));

        $("#sale-modal").modal( {
            backdrop: 'static',
            keyboard: false
        });
    });
});

$("#previous-page").on("click", function(e) {
    if(page > 1) {
        page = page - 1;
    }
    loadSaleData();
});

$("#next-page").on("click", function(e) {
    page = page + 1;
    loadSaleData();
});