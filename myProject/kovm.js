//load json
$(function() {
    //Fetch data from server and create a view model.
    $.ajax({
            url: "/myProject/",
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json'
        }).done(function(response) {
            log(response);
            var foo = response.objectives;
            log(foo);
            vm = new ViewModel(foo);
            ko.applyBindings(vm);
        })
        .fail(function(xhr, status, error) {
            log(xhr);
            log(status);
            log(error);
    });
});

//update json
function remoteUpdate(currentIndicator) {
    $.ajax({
            url: '/myProject/',
            type: 'PUT',
            dataType: 'json',
            contentType: 'application/json',
            data: ko.toJSON(currentIndicator)
        })
        .done(function(returnedData) {
            //log(returnedData);
        })
        .fail(function(xhr, status, error) {
            log(xhr);
            log(status);
            log(error);
    });
};

function log(s) {
    console.log(s);
}

// View Model
function ViewModel(data) {
    var self = this;
    
}
