if (Meteor.isClient) {

    Router.route('/', function () {
        // render the Home template with a custom data context
        this.render('homepage');
    });

    Router.route('/orderconfirmation', function () {
        this.render('orderconfirmation');
    });


    // counter starts at 0
    Session.setDefault('counter', 0);
    Session.setDefault("searchPageEnb", true);
    Session.setDefault("itemSelectPageEnb", false);
    Session.setDefault("itemResultPageEnb", false);
    Session.setDefault("paymentPageEnb", false);
    Session.setDefault("brainTreeUp", false);
    Session.setDefault("successPurchaseUp", false);



    Template.hello.helpers({
        counter: function () {
            return Session.get('counter');
        }
    });

    Template.hello.events({
        'click button': function () {
            // increment the counter when button is clicked
            Session.set('counter', Session.get('counter') + 1);
        }
    });

    Template.motherPage.searchPageVisible = function () {
        return Session.get('searchPageEnb');
    };

    Template.motherPage.itemSelectPageVisible = function () {
        return Session.get('itemSelectPageEnb');
    };

    Template.motherPage.itemResultPageVisible = function () {
        return Session.get('itemResultPageEnb');
    };

    Template.motherPage.paymentPageVisible = function () {
        return Session.get('paymentPageEnb');
    };

    Template.motherPage.successPurchasePageVisible = function () {
        return Session.get('successPurchaseUp');
    };

    Template.paymentPage.brainTreeToken = function() {
        brainTreeUp = Session.get("");
        var token = "";
        token = Meteor.call('brainTreeToken', function (error, result) {
            if (error) {
                // handle error
                return "test token";
            } else {
                Session.set("braintreetoken", result);
            }
        });
        return Session.get("braintreetoken");
    };

    Template.paymentPage.setupBrainTree = function() {
        var brainTreeUp = Session.get("brainTreeUp");
        if(!brainTreeUp) {
            token = Meteor.call('brainTreeToken', function (error, result) {
                if (error) {
                    // handle error
                    return "test token";
                } else {
                    Session.set("braintreetoken", result);
                }
            });
            token = Session.get("braintreetoken");
            braintree.setup(
                // Replace this with a client token from your server
                token,
                'dropin', {
                    container: 'dropin'
                });
            Session.set("brainTreeUp", true);
        }
    };

    Template.searchPage.events({
        'click button.firstsearch': function (evt, template) {
            var searchItemId = template.find(".searchItemText").value;
            //alert(searchItemId);
            Session.set("searchItemId", searchItemId);
            Session.set("searchPageEnb", false);
            Session.set("itemSelectPageEnb", true);
        }
    });

    Template.itemSelectPage.events({
        'click button.secondsubmit': function (evt, template) {
            Session.set("itemSelectPageEnb", false);
            Session.set("itemResultPageEnb", true);
        }
    });

    Template.itemResultPage.events({
        'click button.thirdsubmit': function (evt, template) {
            Session.set("paymentPageEnb", true);
            Session.set("itemResultPageEnb", false);
        }
    });

    Template.paymentPage.events({
        'click button.fourthsubmit': function (evt, template) {
            //evt.preventDefault();
            //Session.set("successPurchaseUp", true);
            //Session.set("paymentPageEnb", false);
        }
    });

}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
        var config = {
            environment: Braintree.Environment.Sandbox, // OR production
            publicKey: 'ck4mzq7zpb3wvws7',
            privateKey: '4529fc03166445b709e6cb29634f9ad3',
            merchantId: 'ffnvp4kq69cqqz3y'
        };
        BraintreeHelper.getInstance().connect(config);
    });

    Meteor.methods({
        brainTreeToken: function () {
            var options = {}; // fill it, if any
            var response = BraintreeHelper.getInstance().clientTokenGenerate(options);
            var clientToken = response.clientToken;
            return clientToken;
        }
    });
}