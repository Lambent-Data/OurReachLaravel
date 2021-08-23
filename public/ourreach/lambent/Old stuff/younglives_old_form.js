/*___________________________________________________________________________________________________________________________*/
// Section: Here we hide the parent field when the user is a parent, because they can only select themselves.
//          TODO: Hide the mentor field, and autoselect the mentor of the currently chosen parent.
/*___________________________________________________________________________________________________________________________*/
/* Current User Data */
// Set user_name and user_type to that of the current user.
// E.g. user_group = "YoungLives Parent", user_name = "Nora Jones".
var div_user = $(".form-group-1118");
var div_user_selected = $("#fields_1118_chosen");
var user_group = div_user_selected.find(".group-name").text();
var user_name = div_user_selected.text().trim().substring(user_group.length);

// Hide the user data form field
div_user.hide();

var div_parent_dropdown = $(".form-group-1013");
var parent_id = "#fields_1013";

switch (user_group) {
  case "YoungLives Parent":
    //If a parent, hide all fields and fill in user as parent and assigned mentor.
    $(parent_id + " option:contains(" + user_name + ")").prop('selected', true);
    // Now disable the ability to change it by destroying that mechanism.
    $(parent_id + "_chosen a span").text(user_name);
    $(parent_id + "_chosen a div").remove();
    $(parent_id + "_chosen div").remove();
    break;
}
/*___________________________________________________________________________________________________________________________*/
// Section: Here we hide the status (complete/in progress) if status = In Progress.
//          Show it if status = Complete, so that the user can change it back to In Progress.
//          (They might do this if they accidentally marked it as complete, for example).
/*___________________________________________________________________________________________________________________________*/

var div_status_field = $(".form-group-1008");
var status_select = $("#fields_1008");
//Check if selected status is "In Progress". This corresponds to value "104".
if ( status_select.find(":selected").val() == "104") {
  div_status_field.hide();
}
/*___________________________________________________________________________________________________________________________*/
// Section: Add logic to the category/subcategory/template dropdown lists so that
//          The Milestone Name, Recurring/Nonrecurring Goals, and Measure at Start/End fields
//          are auto-populated, depending on the chosen category/subcategory/template.
/*___________________________________________________________________________________________________________________________*/


/*******************************************************************************************************************************/
/* VARIABLES */
/*******************************************************************************************************************************/

/* Categories dropdowns and divs. To tell what field each var corresponds to,
go to Application Structure > Entities List > Milestones > Field configuration.
Then you can check the id of the field. E.g. #fields_1029_0 corresponds to the
first dropdown of the field with id 1029, #fields_1029_1 the second, etc.

All variables prefixed with div_ include both the input (e.g. the dropdown)
and the field's label (e.g. "Template"). These divs are defined so we can hide the entire field
from the form */

var category = $("#fields_1029_0");
var subcategory = $("#fields_1029_1");
var template = $("#fields_1029_2");

var div_category = $(".form-group-1029:nth-of-type(2)");
var div_subcategory = $(".form-group-1029:nth-of-type(3)");
var div_template = $(".form-group-1029:nth-of-type(4)");

/* Measure at start dropdowns and divs. These are multilevel dropdowns to sync
up the category, subcategory, and templates chosen from the above field if
the template in question requires a dropdown for the measures */
var ms_category = "#fields_1052_0";
var ms_subcategory = "#fields_1052_1";
var ms_template = "#fields_1052_2";
var ms_start = "#fields_1052_3";

var div_ms_category = $("div.form-group-1052:nth-child(1)");
var div_ms_subcategory = $("div.form-group-1052:nth-child(2)");
var div_ms_template = $("div.form-group-1052:nth-child(3)");
var div_ms_start = $("div.form-group-1052:nth-child(4)");


/* Measure at end dropdowns and divs. Similar logic to measure at start */
var me_category = "#fields_1053_0";
var me_subcategory = "#fields_1053_1";
var me_template = "#fields_1053_2";
var me_end = "#fields_1053_3";

var div_me_category = $("div.form-group-1053:nth-child(1)");
var div_me_subcategory = $("div.form-group-1053:nth-child(2)");
var div_me_template = $("div.form-group-1053:nth-child(3)");
var div_me_end = $("div.form-group-1053:nth-child(4)");

/* Default measures and divs (i.e. freeform) */
var default_start = $("#fields_1006");
var default_end = $("#fields_1007");

var div_default_start = $(".form-group-1006");
var div_default_end = $(".form-group-1007");

/* Form fields that need to be autofilled when templates are loaded in */
var milestone_name = $("#fields_1002");
var recurring_goals = $("#fields_997");
var nonrecurring_goals = $("#fields_1003");
var measures_type = $("#fields_1056");

/* Other fields */
var category_for_analytics = $("#fields_1065"); // extract the category
var subcategory_for_analytics = $("#fields_1066"); // extract the subcategory
var div_progress = $(".form-group-1054");
var div_measures_type = $(".form-group-1056"); // so we know if it's dropdown, freeform, or no measure
var div_category_for_analytics = $(".form-group-1065");
var div_subcategory_for_analytics = $(".form-group-1066");


/*******************************************************************************************************************************/
/* FUNCTIONS */
/*******************************************************************************************************************************/

/* Clears relevant fields in the form */
function clear_form() {
    milestone_name.val("");
    nonrecurring_goals.val("");
    recurring_goals.val("");
    div_default_start.val("");
    div_default_end.val("");
    default_start.val("");
    default_end.val("");
}

/* Inputs relevant fields in the form */
function load(milestoneName, recurringGoals, nonrecurringGoals) {
    clear_form();
    milestone_name.val(milestoneName);
    recurring_goals.val(recurringGoals);
    nonrecurring_goals.val(nonrecurringGoals);
}

/* For templates that have no measures */
function no_measures(){
    div_default_start.hide();
    div_default_end.hide();
    div_ms_start.hide();
    div_me_end.hide();
    measures_type.val("None");
}

/* For templates that set dropdown measures. Takes the default start measure
start and the default end measure end as arguments. NOTE: since the dropdown
will be dependent on a global list, make sure the parameters, start and end,
are entered EXACTLY as they appear in the global list. Case and whitespace sensitive */
function dropdown_measures(start, end) {
    div_default_start.hide();
    div_default_end.hide();
    div_ms_start.show();
    div_me_end.show();
    $(ms_start + " option:contains(" + start + ")").prop('selected', true);
    $(me_end + " option:contains(" + end + ")").prop('selected', true);
    measures_type.val("Dropdown");
}

/* For templates that have freeform measure types. Takes the default start measure
start and the default end measure end as arguments.*/
function freeform_measures(start, end) {
    div_ms_start.hide();
    div_me_end.hide();
    div_default_start.show();
    div_default_end.show();
    default_start.val(start);
    default_end.val(end);
    measures_type.val("Freeform");
}




/*******************************************************************************************************************************/
/* EXECUTE TEMPLATES */
/*******************************************************************************************************************************/

/* These are fields for analytic purposes, aka extracting the category
and subcategory of this milestone. Hide fields from form, but they will be
invisible and keeping track */
div_subcategory_for_analytics.hide();
div_category_for_analytics.hide();

/* Hide dropdowns depending on conditions. If milestone name is empty,
this means the form is for a new milestone (not editing an existing one)
so hide the subcategory and template dropdowns */
if (milestone_name.val() == "") {
    div_template.hide();
    div_subcategory.hide();
}

/* If measures type if set to something other than "", then that means
we are editing a template. Depending on what measure type, show either
a dropdown, freeform, or nothing for the measures */

if (measures_type.val() == "Dropdown") {
    div_default_start.hide();
    div_default_end.hide();
}

else if (measures_type.val() == "Freeform" || measures_type.val() == "") {
    div_ms_start.hide();
    div_me_end.hide();
}

else if (measures_type.val() == "None") {
    default_start.hide();
    default_end.hide();
    div_ms_start.hide();
    div_me_end.hide();
}

/* Hide the multilevel dropdowns that are associated with measure at start
and measure at end, leaving only the actual measures visible on the form */
div_ms_category.hide();
div_ms_subcategory.hide();
div_ms_template.hide();
div_me_category.hide();
div_me_subcategory.hide();
div_me_template.hide();

div_progress.hide();
div_measures_type.hide();

/* Selectively shows dropdowns when you choose a category */
category.change(function(){
    var field_start = ms_category + " option:contains(" + $(this).find("option:selected").text() + ")";
    $(field_start).prop('selected',true);
    $(ms_category).trigger('change'); //trigger a change, which changes the subcategory dropdown in measures

    var field_end = me_category + " option:contains(" + $(this).find("option:selected").text() + ")";
    $(field_end).prop('selected',true);
    $(me_category).trigger('change'); //trigger a change, which changes the subcategory dropdown in measures

    category_for_analytics.val(category.find("option:selected").text()); // set the category

    div_template.hide();
    if ($(this).find("option:selected").text() == "Choose a category...") {
        div_subcategory.hide()
    }
    else {
        div_subcategory.show();
    }
})

/* Selectively shows dropdowns when you choose a subcategory */
subcategory.change(function() {
    var field_start = ms_subcategory + " option:contains(" + $(this).find("option:selected").text() + ")";
    $(field_start).prop('selected',true);
    $(ms_subcategory).trigger('change'); //trigger a change, which changes the template dropdown in measures

    var field_end = me_subcategory + " option:contains(" + $(this).find("option:selected").text() + ")";
    $(field_end).prop('selected',true);
    $(me_subcategory).trigger('change'); //trigger a change, which changes the template dropdown in measures

    subcategory_for_analytics.val(subcategory.find("option:selected").text()); // set the subcategory

    if ($(this).find("option:selected").text() == "") div_template.hide();
    else div_template.show();
})

/* Determines which template to load in based on user choice */
template.change(function(){
    /* Sync the categories multilevel dropdown, and the measures */
    var field_start = ms_template + " option:contains(" + $(this).find("option:selected").text() + ")";
    $(field_start).prop('selected',true);
    $(ms_template).trigger('change'); //trigger a change, which determines the measures type

    var field_end = me_template + " option:contains(" + $(this).find("option:selected").text() + ")";
    $(field_end).prop('selected',true);
    $(me_template).trigger('change'); //trigger a change, which determines the measures type

    /* Load all templates here.
    NOTE: since the dropdown
    will be dependent on a global list, make sure the parameters, start and end,
    are entered EXACTLY as they appear in the global list. Case and whitespace sensitive*/
    switch($(this).find("option:selected").text()) {

        // HOUSING
            case "Custom Milestone":
                    clear_form();
                    freeform_measures("","");
                    break;
            // Emergency Shelter
                case "Move to shelter through faith congregation":
                    load("Move to shelter through faith congregation", "Make a daily account of all my belongings\nCall friends and family", "Gather my belongings to take to the shelter\nCalculate housing budget\nCheck Provider's Corner for emergency housing options\nResearch and locate appropriate shelter\nJoin Facebook housing groups\nAsk church leaders for support and guidance\nCall a local help hotline\nVisit a local food bank\nTell friends and family where I am");
                    dropdown_measures("Living on street", "Faith congregation");
                    break;
                case "Move to shelter through other volunteer group":
                    load("Move to shelter through other volunteer group", "Make a daily account of all my belongings\nCall friends and family", "Gather my belongings to take to the shelter\nCalculate housing budget\nResearch and locate appropriate shelter\nJoin Facebook housing groups\nTell friends and family where I am\nCall a local help hotline\nVisit a local food bank");
                    dropdown_measures("Living on street", "Volunteer group shelter");
                    break;
                case "Move to traditional shelter":
                    load("Move to traditional shelter", "Make a daily account of all my belongings\nCall friends and family", "Gather my belongings to take to the shelter\nCalculate my housing budget\nResearch and locate appropriate shelter\nJoin Facebook Housing groups\nVisit a traditional shelter\nCall a local help hotline\nVisit a local food bank");
                    dropdown_measures("Living on street", "Traditional shelter");
                    break;
                case "Move to home through rapid rehousing program":
                    load("Move to home through rapid rehousing program", "", "Research local rapid rehousing programs\nCalculate my housing budget\nVisit a rapid rehousing program office\nDetermine fees/costs of different programs\nAsk rapid rehousing program staff for support and guidance\nApply for rapid rehousing");
                    dropdown_measures("Living on street", "Rapid Rehousing program");
                    break;

            // Transitional Housing
                case "Move to transitional housing":
                    load("Move to transitional housing", "", "Research local transitional housing programs\nCalculate my housing budget\nVisit a transitional housing program office\nDetermine fees/costs of different programs\nAsk transitional housing program staff for support and guidance\nApply for transitional housing");
                    dropdown_measures("Living on street", "Transitional housing");
                    break;

            // Stay in current home
                case "Receive rental assistance":
                    load("Receive rental assistance", "Gather materials needed to apply for rental assistance", "Calculate housing budget\nLook up local, state, and federal resources\nApply for voucher programs\nContact public housing agency\nContact a housing counseling center\nGet income verification (pay stubs or other pay verification, such as last year's tax returns, a letter from employers, invoices, etc)\nGet proof of hardship (copies of medical bills, etc)\nResearch local congregations and other organizations who could help with rental payments\nAttend community meeting on housing issues");
                    freeform_measures("", "");
                    break;
                case "Mediate rent with landlord":
                    load("Mediate rent with landlord", "Gather materials needed to engage in landlord mediation", "Calculate housing budget\nContact a tenant's rights group\nArrange for lead paint test - may be important to share with tenant's rights group\nFind a local mediation service\nGet income verification (pay stubs or other pay verification, such as last year's tax returns, a letter from employer, invoices, etc)\nGet proof of hardship (copies of medical bills, etc)\nAttend community meeting on housing issues");
                    no_measures();
                    break;
                case "Receive mortgage assistance":
                    load("Receive mortgage assistance", "Open and regularly respond to mail from lender\nStudy mortgage rights", "Make appointment with bank\nContact a housing counselor approved by the US Department of Housing\nContact lender to discuss difficulty making payments\nReview budget\nApply for federal mortgage assistance programs\nApply for foreclosure mediation programs\nResearch local congregations and other organizations who could help with mortgage payments\nGet income verification (pay stubs or other pay verification, such as last year's tax returns, a letter from employer, invoices, etc)\nGet proof of hardship (copies of medical bills, etc)\nAttend community meeting on housing issues");
                    no_measures();
                    break;
                case "Restructure mortgage":
                    load("Restructure mortgage", "Open and regularly respond to mail from lender\nStudy mortgage rights", "Review qualifications for mortgage restructuring programs\nApply for federal restructuring programs\nGet income verification (pay stubs or other pay verification, such as last year's tax returns, a letter from employer, invoices, etc)\nGet proof of hardship (copies of medical bills, etc)\nContact lender to discuss options\nAttend community meeting on housing issues");
                    no_measures();
                    break;

            // Permanent Housing
                case "Rent a home":
                    load("Rent a home", "Search for rental apts/houses online\nSearch for rental apts/houses in the newspaper\nApply for apartment\nRespond to rental listings\nAsk friends about rental apt/house prices\nCompare rental apts/houses on real-estate app such as Zillow\nSearch for rental apts/houses on Facebook Marketplace and Craigslist\nApply to a different housing development today", "Calculate my housing budget\nJoin Facebook housing groups\nAsk landlord about reduced rent\nMake appointment and rental affordable housing program\nVisit an open house\nVisit rental apts/houses\nCheck how far away rental is from work, school, childcare, stores, and family\nSave for down payment\nMake appointment with bank\nCheck for household safety hazards in desired apt/home\nArrange for lead paint test in desired home\nAttend community meeting on housing issues");
                    freeform_measures("", "");
                    break;
                case "Buy a home":
                    load("Buy a home", "Search online apts/houses for sale\nSearch in newspaper for apts/houses for sale\nRespond to housing listings\nAsk friends about apt/house prices for sale\nCompare apts/houses on real-estate app", "Calculate my housing budget\nJoin Facebook housing groups\nVisit an open house\nCheck my credit score\nMake appointment with affordable housing purchase program\nFind a real estate agent\nMake appointment with bank\nCheck how far away house is from work, school, childcare, stores, and family\nCheck for household safety hazards in desired apt/home\nArrange for lead paint test in desired home\nArrange for house inspection\nAttend community meeting on housing issues");
                    freeform_measures("", "");
                    break;
                case "Find permanent supportive housing":
                    load("Find permanent supportive housing", "", "Research local supportive housing programs\nCalculate my housing budget\nVisit a supportive housing program office\nDetermine fees/costs of different programs\nAsk supportive housing program staff for support and guidance\nApply for supportive housing\nAttend community meeting on supportive housing");
                    freeform_measures("", "");
                    break;

        // MONEY MANAGEMENT
            // Budgeting
                case "Make a financial plan for the future":
                    load("Make a financial plan for the future", "Record my income and expenses for the day\nDo 30 minutes in trusted online financial literacy course", "Make a list of needs & wants\nBuild my six-month budget\nTalk to family about budget planning\nPlan for emergency fund\nPlan for monthly payment(s) towards debt\nPlan for saving beyond emergency fund\nFind a financial advisor (free and trusted program at non-profit org., library, church, etc.)\nEnroll in trusted online financial literacy program\nMake budgt spreadsheet\nUse trusted online budget service (like mint.com) without linking accounts\nLink accounts with trusted online budget service (like mint.com)");
                    no_measures();
                    break;
                case "Create and stick to monthly and weekly budgets":
                    load("Create and stick to monthly and weekly budgets", "Record my income and expenses as they occur\nDo 30 minutes in trusted online financial literacy course\nComparison shop when buying items", "Make a list of needs & wants\nBuild my monthly budget\nBuild my weekly budget\nMake sure to include items that occur less often than monthly\nTalk to family about budget planning\nEnroll in trusted online financial literacy program\nAsk financial advisor (free program at non-profit org., library, church etc.) about budgeting");
                    no_measures();
                    break;
                case "Participate in financial child support":
                    load("Participate in financial child support", "Communicate with other parent about payment schedule (in-person, through text, through a lawyer, etc)\nKeep updated on state's child support guidelines\nMake child support payment\nCheck that I received child support payment\nCheck that parent or guardian received child support payment\nCheck that parent or guardian made child support payment", "Include child support in current budget\nConsider different payment options (Venmo, Zell, etc)\nChoose best payment option (Venmo, Zell, etc)\nContact Child support Services or family law attorney for assistance or questions\nContact Child Support Services or family law attorney if trying to modify child support order");
                    no_measures();
                    break;
            // Personal Finance
                case "Plan to reduce debt":
                    load("Plan to reduce debt", "Consider credit card interest rate before using card\nSave enough to pay $10 more than minimum payment on credit card each month", "Talk to family or friend(s) about reducing debt\nAvoid payday loans\nList the interest rates on my credit cards\nTrack credit card payments\nPay credit cards on time\nPay student loans on time\nAsk financial advisor (free program at non-profit org., library, church, etc.) about reducing debt\nPay more than minimum on highest rate credit cards\nBrainstorm with a trusted advisor about creative ways to make more money\nBrainstorm with a trusted advisor about areas to cut back (stop buying coffee out, switching to a cheaper phone plan, etc), Learn about Dave Ramsey's Debt Snowall");
                    no_measures();
                    break;
                case "Get out of OverDraft":
                    load("Get out of OverDraft", "Refer to list of payments due and income expected", "Make list of payments due and income expected (use paper or computer)\nSet up overdraft protection\nSchedule appointment at bank");
                    no_measures();
                    break;
                case "Establish checking account at bank":
                    load("Establish checking account at bank", "", "Ask financial advisor (free program at non-profit org., library, church, etc.) about banks\nResearch banks for favorable programs (low-cost checking, available ATMs, etc.)\nSchedule appointment at bank");
                    no_measures();
                    break;
                case "Establish Emergency Fund":
                    load("Establish Emergency Fund", "Put 5% of every paycheck into emergency fund","Open savings account\nSchedule appointment at bank\nFind introductory interest-free repayment credit card to use just in emergencies");
                    no_measures();
                    break;
                case "Establish good credit":
                    load("Establish good credit", "Do 30 minutes in trusted online financial literacy course\nSave enough to pay $10 more than minimum payment on credit card each month\nPay student loans on time\nCheck for credit report errors", "Ask financial advisor (free program at non-profit org., library, church, etc.) about building good credit\nResearch banks for favorable credit cards with low interest\nSchedule appointment at bank\nAvoid payday loans\nOrganize my credit records\nApply for secured credit card account(s)");
                    no_measures();
                    break;
            // Income Programs
                case "Establish necessary identification documents":
                    load("Establish necessary identification documents", "", "Identify programs that would match my needs\nMake a list of each program's required identification documents\nContact program representative with questions\nOrganize required identification documents\nSign-up for driving (to get driver's license)\nContact state department of vital records (to get birth certificate)");
                    no_measures();
                    break;
                case "Apply for SNAP":
                    load("Apply for SNAP", "", "Make a budget of current needs and spending\nMake a list of needs (based on current income, spending, etc)\nCheck that SNAP matches my needs\nResearch state eligibility requirements (resource and income limits, etc)\nCheck that I match state's eligibility requirements (resource and income limits, etc)\nCall state's SNAP information hotline with questions\nVisit state agency's website for more information\nSubmit state's SNAP application\nDo eligibility interview\nAfter certification period ends, apply to recertify to continue receiving SNAP benefits\nContact local SNAP office with questions\nRequest a fair hearing with an official (if I disagree with a decision made on my SNAP case)");
                    no_measures();
                    break;
                case "Apply for WIC":
                    load("Apply for WIC", "", "Make a budget of current needs and spending\nMake a list of needs (based on current income, spending, etc)\nCheck that WIC matches my needs\nContact state or local agency to set up an appointment\nResearch state eligibility requirements (category, residency, income, nutrition risk, etc)\nCheck that I match state's eligibility requirements (category, residency, income, nutrition risk, etc)\nBring all required materials to WIC appointment");
                    no_measures();
                    break;
                case "Participate in relevant income programs":
                    load("Participate in relevant income programs", "", "Make a budget of current needs and spending\nMake a list of needs (based on current income, spending, etc)\nResearch state and federal programs\nIdentify programs that would match my needs\nCheck program eligibility requirements (income level, residency requirements, etc)\nMake a list of each program's required identification documents\nContact program representative with questions\nApply to programs that would match my needs");
                    no_measures();
                    break;


        // HEALTH
            // Main
                case "HbA1c":
                    load("Reach target HbA1c level", "Plan 5 healthy recipes to cook this week\nWalk/Exercise for 30 minutes\nMake weekly shopping list for healthy meals\nDrink less alcohol\nGo grocery shopping\nSleep at least 6 hours total tonight\nLook up new healthy recipe\nDo monthly weigh-in\nTake prescribed medication in AM\nTake prescribed medication in PM\nDrink 6 glasses of water\nEat 6 servings of fruits/vegetables\nWrite in my gratitude journal\nMeditate/Do deep breathing\nCheck blood sugar levels according to doctor\nCheck feet daily", "Ask family or friend(s) to support healthy food choices\nSign up for nutrition plan\nSign up for exercise plan\nResearch places to buy discounted fruits and vegetables\nTalk with family or friend(s) about diabetes\nAttend diabetes support group\nSchedule an eye exam");
                    freeform_measures("___%", "___%");
                    break;
                case "Preventative Care":
                    load("Preventative care for this calendar year", " ", "Schedule annual physical\nHave annual physical\nSchedule dentist visit\nGo to dentist\nEnroll in a stop smoking program\nSchedule mammogram\nHave mammogram\nDiscuss contraceptive options with OB\nTake contraceptive\nChoose not to smoke today");
                    no_measures();
                    break;
                case "Early Morning Fasting Blood Sugar Level":
                    load("Reach target blood sugar level", "Plan 5 healthy recipes to cook this week\nWalk/Exercise for 30 minutes\nReduce alcohol intake\nSleep at least 6 hour total tonight\nLook up new healthy recipe\nTake prescribed medication in AM\nDo monthly weigh-in\nTake prescribed medication in PM\nEat 6 servings of fruits/vegetables\nWrite in my Gratitude Journal\nAttend diabetes support group\nMeditate/Do deep breathing\nCheck blood sugar levels according to doctor\nCheck feet daily", "Ask family or friend(s) to support healthy food choices\nSign up for nutrition plan\nSign up for exercise plan\nTalk with family or friends about diabetes\nSchedule an eye exam\nGo to eye exam");
                    freeform_measures("___mg/dL", "___mg/dL");
                    break;
                case "Blood Pressure":
                    load("Reach target blood pressure level", "Plan 5 healthy recipes\nWalk/Exercise for 30 minutes\nDrink less alcohol\nSleep for eat least 6 hours total tonight\nTake prescribed medication in AM\nDo monthly weigh-in\nTake prescribed medication in PM\nEat 6 servings of fruits/vegetables\nAttend hypertension support group\nWrite in my Gratitude Journal\nMeditate/Do deep breathing\nTake a break from social media\nTrack whether foot/toe pain wakes me\nCheck blood pressure level according to doctor\nTake aspirin as recommended by doctor", "Ask family or friend(s) to support healthy food choices\nSign up for nutrition plan\nSign up for exercise plan\nLook up new healthy recipe\nSchedule an eye exam\nGo to eye exam\nTalk with family or friend(s) about having hypertension");
                    freeform_measures("___mmHg", "___mmHg");
                    break;
                case "Weight":
                    load("Reach target weight level", "Plan 5 healthy recipes to cook this week\nWalk/Exercise for 30 minutes\nDrink less alcohol\nLook up new healthy recipe\nSleep at least 6 hours total tonight\nDo monthly weigh-in\nTake prescribed medication in AM\nTake prescribed medication in PM\nEat 6 servings of fruits/vegetables\nWrite in my Gratitude Journal\nMeditate/Do deep breathing\nTake a break from social media\nDrink water instead of soda or juice\nEat 3 meals a day", "Ask family or friend(s) to support healthy food choices\nSign up for nutrition plan\nSign up for exercise plan");
                    freeform_measures("___lbs", "___lbs");
                    break;
                case "Height":
                    load("Track height", "", "");
                    freeform_measures("___ft", "");
                    break;
                case "BMI":
                    load("Reach target BMI", "Plan 5 healthy recipes to cook this week\nWalk/Exercise for 30 minutes\nDrink less alcohol\nLook up new healthy recipe\nSleep at least 6 hours total tonight\nDo monthly weigh-in\nTake prescribed medication in AM\nTake prescribed medication in PM\nEat 6 servings of fruits/vegetables\nWrite in my Gratitude Journal\nMeditate/Do deep breathing\nTake a break from social media\nDrink water instead of soda or juice\nEat 3 meals a day", "Ask family or friend(s) to support healthy food choices\nSign up for nutrition plan\nSign up for exercise plan");
                    freeform_measures("", "");
                    break;
            // Mental Health
                case "Peace Level":
                    load("Reach target peace level","Write in Gratitude Journal\nMeditate/Do deep breathing for at least 60 seconds\nPray\nTake a break from social media\nTake prescribed mental health medication\nGo to one-on-one therapy sessions\nGo to family/couples therapy sessions\nRead the Bible\nGo for a walk\nParticipate in faith congregation services\nListen to inspiring music\nListen to worship music\nRead a chapter of a book by my favorite author", "Find a therapist or psychiatrist covered by health insurance\nAsk family or friend(s) to support mental health choices\nSet screen time limit on phone for social media\nAttend group support meetings\nTalk with a friend or family member about challenges and/or joys\nPractice handling stressful situation (such as an upcoming difficult conversation)");
                    no_measures();
                    break;

        // Jobs
            // Location
                case "Close to home":
                    load("Close to home", "Ask friends or family about job openings\nSearch online for jobs\nCheck the newspaper for jobs\nSubmit an application to 2 job openings\nReflect, talk to friends and family\nPrepare for job interview", "Update resume\nUpdate cover letter\nPrepare 5 job interview questions\nAsk friend, family, or mentor to look over the resume and cover letter before sending it out\nUpload resume and cover letter to job-finding sites");
                    no_measures();
                    break;
                case "Close to child/ren's school/s":
                    load("Close to child/ren's school/s", "Ask friends or family about job openings\nSearch online for jobs\nCheck the newspaper for jobs\nSubmit an application to 2 job openings\nReflect, talk to friends and family\nPrepare for job interview", "Update resume\nUpdate cover letter\nPrepare 5 job interview questions\nAsk friend, family, or mentor to look over the resume and cover letter before sending it out\nUpload resume and cover letter to job-finding sites");
                    no_measures();
                    break;
                case "Easy Commute":
                    load("Easy Commute", "Ask friends or family about job openings\nSearch online for jobs\nCheck the newspaper for jobs\nSubmit an application to 2 job openings\nReflect, talk to friends and family\nPrepare for job interview", "Get a MetroCard, bus pass, transit pass, etc\nUpdate resume\nUpdate cover letter\nPrepare 5 job interview questions\nAsk friend, family, or mentor to look over the resume and cover letter before sending it out\nUpload resume and cover letter to job-finding sites");
                    no_measures();
                    break;
            // Income & Benefits
                case "Income is enough to support my family":
                    load("Income is enough to support my family", "Ask friends about job openings\nSearch online for jobs\nCheck the newspaper for jobs\nSpend time networking\nWork on improving skills\nSubmit an application to 2 job listings\nPrepare for job interview", "Update resume\nUpdate cover letter\nPick appropriate attire for interview\nLook up employee testimonials on online job sites (such as LinkedIn, Glassdoor, etc)\nLook over budget\nDiscuss different job opportunities with family\nPrepare 5 job interview questions\nAsk friend, family, or mentor to look over the resume and cover letter before sending it out\nUpload resume and cover letter to job-finding sites");
                    no_measures();
                    break;
                case "Income is enough to live comfortably":
                    load("Income is enough to live comfortably", "Ask friends about job openings\nSearch online for jobs\nCheck the newspaper for jobs\nSpend time networking\nWork on improving skills\nSubmit an application to 2 job listings\nPrepare for job interview", "Update resume\nUpdate cover letter\nPick appropriate attire for interview\nLook up employee testimonials on online job sites (such as LinkedIn, Glassdoor, etc)\nLook over budget\nDiscuss different job opportunities with family\nPrepare 5 job interview questions\nAsk friend, family, or mentor to look over the resume and cover letter before sending it out\nUpload resume and cover letter to job-finding sites");
                    no_measures();
                    break;
                case "Amount and type of benefits I want":
                    load("Amount and type of benefits I want", "Ask friends about job openings\nSearch online for jobs\nCheck the newspaper for jobs\nSpend time networking\nWork on improving skills\nSubmit an application to 2 job listings\nPrepare for job interview", "Update resume\nUpdate cover letter\nPick appropriate attire for interview\nLook up employee testimonials on online job sites (such as LinkedIn, Glassdoor, etc)\nTalk to company recruiter\nResearch more about benefits\nPrepare 5 interview questions\nAsk potential employer about benefits after the interview\nAsk friend, family, or mentor to look over the resume and cover letter before sending it out\nUpload resume and cover letter to job-finding sites");
                    no_measures();
                    break;
            // Schedule
                case "Reliable work schedule similar each week":
                    load("Reliable work schedule similar each week", "Ask friends about job openings\nSearch online for jobs\nCheck the newspaper\nSpend time networking\nWork in improving skills\nPractice talking with manager to ask for new schedule\nSubmit an application to 2 job listings for steadier job", "Update resume\nUpdate cover letter\nPick appropriate attire for interview\nLook up employee testimonials on online job sites (such as LinkedIn, Glassdoor, etc)\nTalk to company recruiter\nMap out schedule I would like\nMake appointment to talk with manager to ask for new schedule\nPrepare 5 interview questions\nPlan childcare\nResearch work-from-home jobs");
                    no_measures();
                    break;
                case "Work hours during time of day/night I want":
                    load("Work hours during time of day/night I want", "Ask friends about job openings\nSearch online for jobs\nCheck the newspaper\nSpend time networking\nWork on improving skills\nPractice talking with manager to ask for new schedule\nSubmit an application to 2 job listings for steadier job", "Update resume\nUpdate cover letter\nPick appropriate attire for interview\nLook up employee testimonials to online job sites (such as LinkedIn, Glassdoor, etc)\nTalk to company recruiter\nMap out schedule I would like\nMake appointment to talk with manager to ask about new schedule\nPrepare 5 interview questions\nPlan childcare\nResearch work-from-home jobs");
                    no_measures();
                    break;
                case "Number of work hours I want":
                    load("Number of work hours I want", "Ask friends about job openings\nSearch online for jobs\nCheck the newspaper\nSpend time networking\nWork on improving skills\nPractice talking with manager to ask for new schedule\nSubmit an application to 2 job listings with number of hours I want\nPrepare for job interviews", "Update resume\nUpdate cover letter\nPick appropriate attire for interview\nLook up employee testimonials on online job sites (such as LinkedIn, Glassdoor, etc)\nTalk to company recruiter\nMap out schedule I would like\nMake appointment to talk with manager to ask for new schedule\nPrepare 5 interview questions");
                    no_measures();
                    break;

            // Enjoyment
                case "I make a positive difference":
                    load("I make a positive difference", "Ask friends about job openings\nSearch online for jobs\nCheck the newspaper for jobs\nSpend time networking\nWork on improving skills\nSubmit an application to 2 job listings\nPrepare for job interview\nReflect, talk to fellow co-workers, friends, and family", "Update resume\nUpdate cover letter\nPick appropriate attire for interview\nLook up employee testimonials on online job sites (such as LinkedIn, Glassdoor, etc)\nPrepare 5 interview questions");
                    no_measures();
                    break;
                case "I enjoy my coworkers":
                    load("I enjoy my coworkers", "Ask friends about job openings\nSearch online for jobs\nCheck the newspaper for jobs\nSpend time networking\nWork on improving skills\nSubmit an application to 2 job listings\nPrepare for job interview\nReflect, talk to fellow co-workers, friends, and family", "Update resume\nUpdate cover letter\nPick appropriate attire for interview\nLook up employee testimonials on online job sites (such as LinkedIn, Glassdoor, etc)\nPrepare 5 interview questions");
                    no_measures();
                    break;
                case "I feel appreciated & valued":
                    load("I feel appreciated & valued", "Ask friends about job openings\nSearch online for jobs\nCheck the newspaper for jobs\nSpend time networking\nWork on improving skills\nSubmit an application to 2 job listings\nPrepare for job interview\nReflect, talk to fellow co-workers, friends, and family", "Update resume\nUpdate cover letter\nPick appropriate attire for interview\nLook up employee testimonials on online job sites (such as LinkedIn, Glassdoor, etc)\nSchedule meeting with manager\nPrepare 5 interview questions");
                    no_measures();
                    break;
                case "I love what I do":
                    load("I love what I do", "Ask friends about job openings\nSearch online for jobs\nCheck the newspaper for jobs\nSpend time networking\nWork on improving skills\nSubmit an application to 2 job listings\nPrepare for job interview\nReflect, talk to fellow co-workers, friends, and family\nPractice for meeting with manager about different responsibilities", "Update resume\nUpdate cover letter\nPick appropriate attire for interview\nSchedule meeting with manager\nPrepare 5 interview questions");
                    no_measures();
                    break;
                case "It challenges me to grow":
                    load("It challenges me to grow", "Ask friends about job openings\nSearch online for jobs\nCheck the newspaper for jobs\nSpend time networking\nWork on improving skills\nSubmit an application to 2 job listings\nPrepare for job interview\nReflect, talk to fellow co-workers, friends, and family\nPractice for meeting with manager about different responsibilities", "Update resume\nUpdate cover letter\nPick appropriate attire for interview\nSchedule meeting with manager\nPrepare 5 interview questions");
                    no_measures();
                    break;
                case "It fits my personality":
                    load("It challenges me to grow", "Ask friends about job openings\nSearch online for jobs\nCheck the newspaper for jobs\nSpend time networking\nWork on improving skills\nSubmit an application to 2 job listings\nPrepare for job interview\nReflect, talk to fellow co-workers, friends, and family\nPractice for meeting with manager about different responsibilities", "Update resume\nUpdate cover letter\nPick appropriate attire for interview\nSchedule meeting with manager\nPrepare 5 interview questions");
                    no_measures();
                    break;


        // Education
            // Education Level
                case "High school diploma":
                    load("High school diploma", "Do study session with friend\nComplete homework assignments\nReview homework requirements\nMak flashcards for test\nPractice using computer\nRead for fun for 30 minutes\nAttend after-school tutoring with my teacher\nGo to the school library to do homework", "Talk with guidance counselor\nSet up a quiet place in my home to study and do homework\nFind a study group\nMake a plan for doing daily homework\nMake a plan for doing longer projects\nExplore ways to learn STEM(Science, Tech, Engin, Math)");
                    dropdown_measures("Some high school completed", "High school diploma");
                    break;
                case "GED":
                    load("GED", "Do study session with friend\nStudy for GED exam for 1 hour\nPractice using computer\nRead for fun for 30 minutes\nMake flashcards for test", "Research requirements for GED\nFind online prep course\nOrder study materials online\nMake a plan for studying for GED\nTake a practice GED exam\nReview completed practice exam\nCheck exam locations\nRegister for GED exam\nPrepare proper identification for exam\nCheckout a GED prep book from the library\nSet a budget for prep courses and the test");
                    dropdown_measures("Some high school completed", "GED");
                    break;
                case "Associate's degree":
                    load("Associate's degree", "Work on application materials for community college\nDo homework\nDo study session with friend\nWork on application essay", "Talk with guidance counselor at school about applying to community college\nResearch community college\nApply for community college\nApply for financial aid and scholarships\nEnroll at community college\nTrack degree progress and credit requirements\nTalk with course advisor at community college\nFind a study group\nOrder study materials online\nCreate flashcards\nCheck ways to learn STEM (Science, Tech, Engin, Math) in community college\nMake a plan for doing daily homework\nMake a plan for doing longer projects\nAsk teacher or mentor for recommendation letter\nResearch fields and programs\nRequest copies of GED/high school transcript\nAsk guidance counselor for application fee waivers");
                    dropdown_measures("Some high school completed", "Associate's degree");
                    break;
                case "Bachelor's degree":
                    load("Bachelor's degree", "Work on application materials for college/university\nDo homework\nDo study session with friend\nResearch internships\nWork on application essays\nAsk guidance counselor to review and edit application essay\nWork on scholarship application materials/Apply for scholarships\nStudy for SAT\nStudy for ACT\nMake flashcards for test", "Talk with guidance counselor at school about applying to college/university\nResearch colleges/universities (including children-friendly ones)\nApply for colleges/university\nApply for financial aid and scholarships\nEnroll att college/university\nTrack degree progress and credit requirements\nTalk with academic advisor at college/university\nMake a plan for doing daily homework\nMake a plan for doing longer projects\nFind a study group\nOrder study materials online\nApply for internships\nGo to tutoring sessions\nCheck ways to learn STEM (Science, Tech, Engin, Math) in college/university");
                    dropdown_measures("High school diploma", "Bachelor's degree");
                    break;
                case "Military with related training":
                    load("Military with related training", "Think about elements involved with military active-duty and reserves\nTalk with family and friends about military\nWork on application materials for military", "Talk with guidance counselor at school about military\nResearch programs in military\nApply for military\nCheck ways to learn STEM (Science, Tech, Engin, Math) in military\nResearch commitments before enlisting\nEnlist in military active-duty\nEnlist in military reserves\nKnow schedule for first three months before enlisting");
                    dropdown_measures("High school diploma", "Military with related training");
                    break;
                case "Trade/technical/vocational training":
                    load("Trade/technical/vocational training", "Work on application materials for trade/technical/vocational training\nDo study session with friend\nDo homework\nPractice technical skills", "Talk with guidance counselor at school about trade/technical/vocational training\nStudy for trade school entrance exam\nApply for financial aid and scholarships\nApply for apprenticeships\nJoin a study group\nCheck ways to learn STEM (Science, Tech, Engin, Math) in trade/technical/vocational training\nMake a plan for doing daily homework\nMake a plan for doing longer projects\nResearch vocational schools in the area\nResearch childcare options");
                    dropdown_measures("High school diploma", "Trade/technical/vocational training");
                    break;
                case "Postgraduate degree":
                    load("Postgraduate degree", "Work on application materials for graduate program\nDo homework\nDo study session with friend\nMake flashcards for test", "Talk with academic advisor at school about applying to graduate programs\nResearch graduate programs (including children-friendly ones)\nTake the GRE/other entrance exam(s)\nAsk for references\nApply for colleges/universities\nApply for financial aid and scholarships\nEnroll at college/university\nTrack degree programs and credit requirements\nTalk with academic advisor in grad program\nFind a study group\nMake a plan for doing daily homework\nMake a plan for doing longer projects");
                    dropdown_measures("Bachelor's degree", "Postgraduate degree");
                    break;
           // Location
                case "Close to home ":
                    load("Close to home", "" , "Talk with guidance counselor at school\nCheck locations of courses before enrolling\nGet a MetroCard, bus pass, transit pass, etc\nSearch online for degree programs nearby");
                    no_measures();
                    break;
                case "Close to child/ren's school/s ":
                    load("Close to child/ren's school/s ", "" , "Talk with guidance counselor at school\nCheck locations of courses before enrolling\nGet a MetroCard, bus pass, transit pass, etc\nSearch online for degree programs nearby");
                    no_measures();
                    break;
                case "Easy commute ":
                    load("Easy commute ", "" , "Talk with guidance counselor at school\nCheck locations of courses before enrolling\nGet a MetroCard, bus pass, transit pass, etc\nSearch online for degree programs nearby");
                    no_measures();
                    break;
                case "Virtual learning that is not self-paced ":
                    load("Virtual learning that is not self-paced", "Use online scheduling tool (such as Google calendar) to plan courseload\nPractice using computer", "Schedule meeting with academic advisor to learn about online options at current school\nSearch for online degree programs\nCompare different virtual learning options");
                    no_measures();
                    break;
          // Schedule
                case "Classes scheduled during time of day/night I want":
                    load("Classes scheduled during time of day/night I want", "Use online scheduling tool (such as Google calendar) to plan courseload", "Schedule meeting with academic advisor");
                    no_measures();
                    break;
                case "Online courses I can do at my own pace":
                    load("Online courses I can do at my own pace", "Use online scheduling tool (such as Google calendar) to plan courseload\nPractice using computer", "Schedule meeting with academic advisor to learn about online options at current school\nResearch online self-paced courses in my field at various schools\nSet up a space at home for studying");
                    no_measures();
                    break;

          // Enjoyment
                case "Workload somewhat manageable":
                    load("Workload somewhat manageable", "Use online scheduling tool (such as Google calendar) to manage workload\nDo study session with friend", "Take with guidance counselor at school\nDiscuss time management ideas with family and friends");
                    dropdown_measures("Workload not manageable", "Workload somewhat manageable");
                    break;
                case "Workload fully manageable":
                    load("Workload fully manageable", "Use online scheduling tool (such as Google calendar) to manage workload\nDo study session with friend", "Take with guidance counselor at school\nDiscuss time management ideas with family and friends");
                    dropdown_measures("Workload not manageable", "Workload fully manageable");
                    break;
                case "Healthy school-rest-of-life balance":
                    load("Healthy school-rest-of-life balance", "Use online scheduling tool (such as Google calendar) to manage workload\nWalk/exercise for 30 minutes\nSpend some time with friends\nStudy when baby is napping", "Take with guidance counselor at school\nDiscuss school-rest-of-life balance with family and friends\nAsk friend or family to babysit once a week so I can study");
                    freeform_measures("", "");
                    break;
                case "I like going to class":
                    load("I like going to class", "Reflect on the class: talk to a friend, fellow students, or a family member\nWrite in my gratitude journal", "Talk with guidance counselor at school");
                    freeform_measures("", "");
                    break;
                case "It challenges me to grow ":
                    load("It challenges me to grow", "Reflect on the class: talk to a friend, fellow students, or a family member\nWrite in my gratitude journal", "Talk with guidance counselor at school");
                    freeform_measures("", "");
                    break;
                case "Class topics genuinely interest me":
                    load("Class topics genuinely interest me", "Reflect on the class: talk to a friend, fellow students, or a family member\nWrite in my gratitude journal","Talk with guidance counselor or academic advisor\nLook up course descriptions\nAsk previous students about the material, professors, interests, etc");
                    freeform_measures("", "");
                    break;

        // CHILDREN
            // Prenatal Specific
                case "Deliver a healthy baby":
                    load("Deliver a healthy baby", "Take prenatal vitamin\nEliminate or limit caffeine to no more than 200 mg per day (one 12 ounce cup of coffee; check amounts in soda, etc)\nEliminate alcohol & other unprescribed drugs\nPractice deep breathing\nMake time for nourishing friendships\nRead at least 15 minutes of pregnancy book\nHow am I feeling today? Call the doctor if I think what I am feeling isn't normal\nGo to prenatal medical appointments\nGo to prenatal exercise classes (such as yoga)\nGo to breastfeeding classes\nFollow stop smoking plan\nSing to unborn baby\nTalk to unborn baby", "Talk with care provider about healthy foods\nAsk family or friend to support healthy food choices\nEnroll in a stop smoking plan for pregnancy\nMake sure I am up to date on immunizations\nAsk Doctor about how current prescription medications may affect the baby\nTour the hospital and delivery ward\nComplete prenatal genetic testing\nLearn about family health history with partner\nSchedule self-care\nResearch signs of labor, to know when to call OB / go to hospital\nRegister for childbirth class\nRegister for breastfeeding class\nRegister for prenatal exercise class (such as yoga)\nWrite up my birth plan\nChoose pediatrician to visit baby in hospital");
                    no_measures();
                    break;
                case "Prepare for baby coming home":
                    load("Prepare for baby coming home", "Read at least 15 minutes about child development", "Baby proof house/apartment\nArrange for lead paint test\nPrepare a safe sleep area for baby\nSet up changing supplies\nWash, fold, and hang baby supplies\nSet up area for baby's items\nPrepare meals and put them in a freezer\nResearch resources for safe baby items that are free/discounted\nRegister all new baby items for recalls\nResearch breast pumps covered by insurance\nPlan how to travel to pediatrician for baby's 1st visit 2 days after discharge from hospital\nGet car seat if baby will be traveling in a car from hospital (even taxi)\nInstall car seat in car in which baby will be traveling from hospital");
                    no_measures();
                    break;
            // From Birth Onward
                case "Raise a happy & healthy child":
                    load("Raise a happy & healthy child", "Read for 20 minutes with child/ren\nPlay one-on-one for 30 minutes\nExercise together for 20 minutes\nHave dinner as a family\nPlay stacking/building games\nPlay singing/clapping games\nEstablish a bedtime routine (e.g., skin care, song, book, then bed)\nPray as a family\nHave my child/ren help in household tasks\nHelp my child/ren with homework\nDo arts/crafts with child/ren\nDo storytelling with child/ren\nTalk to my child about all that's going on, to build language\nKeep the TV turned off when my baby is around\nLimit screen time (less than 1 hour for children and none for babies under 2)\nTummy time for babies after each feeding\nSafely visit a park\nGo to support meeting for parents", "Research support meetings for parents\nTalk about family rules with my kids\nAttend parent/guardian group meeting at school\nCheck library programs for ages of my kids\nCheck online resources for at-home-learning\nHave a family game/movie night");
                    no_measures();
                    break;
                case "Raise a happy & healthy newborn (0-2 months)":
                    load("Raise a happy & healthy newborn (0-2 months)", "Track wet/dry diapers\nCheck if baby is jaundiced\nFeed baby every 3 hourrs or more frequently if needed\nTummy time after each feeding (including baby sleeping on awake mom's chest)\nCheck for safe sleeping every time baby sleeps\nDo proper umbilical cord care\nRead a book with my baby\nPlay finger games with my baby\nPlay singing games with my baby\nTalk with my baby\nRead 15 minutes about infant development\nGo to lactation (breastfeeding) consultant appointment\nGo to breastfeeding support group\nGo to parent support group", "Talk with care provider about whether family or friends will be allowed to visit\nTalk with family & friends about whether they will be allowed to visit\nMake an appointment with a lactation (breastfeeding) consultant\nMake sure pediatrician visits baby in hospital or birth center\nGo to pediatrician appointment less than 2 days after hospital / birth center discharge\nGo to 1 month pediatrician appointment\nGo to 2 month pediatrician appointment\nMake sure baby's sleeping area is safe\nResearch breastfeeding support group\nResearch parent support group\nResearch tongue ties in babies");
                    no_measures();
                    break;
                case "Be healthy in the three-plus months after giving birth":
                    load("Be healthy in the three-plus months after giving birth", "Continue to take prenatal vitamin\nMonitor blood pressure\nTake prescribed medications for blood pressure\nWatch for POST-BIRTH warning signs of blood clots, severe headache, etc to call OB or go to ER\nWatch for warning signs of blood clots, embolism, etc\nReach out to family/friend(s) for support\nTell a friend I'm having trouble with anxiety or depression\nDrink 128 ounces of water per day\nGo to lactation (breastfeeding) consultant\nGo to breastfeeding support group\nGo to parent support group", "Research POST-BIRTH warning signs of blood clots, severe headache, etc to call OB or go to ER\nMake appointment with a lactation (breastfeeding) consultant\nGo to six week post-partum appointment\nComplete post-partum mental health screening\nResearch post-birth warning signs of blood clots, severe headache, etc to call OB or go to ER\nLearn about shaken baby syndrome\nDiscuss with OB about returning to contraceptive\nResearch breastfeeding support group\nResearch parent support group");
                    no_measures();
                    break;
            // Pediatrician well visits and vaccinations
                case "Doc well visits & vaccines (0-6 months)":
                    load("Pediatrician well visits and vaccinations (0-6 months)", "Go to pediatrician well visit\nGo to vaccination visit", "Schedule pediatrician well visits\nSchedule vaccinations");
                    no_measures();
                    break;
                case "Doc well visits & vaccines (7-18 months)":
                    load("Pediatrician well visits and vaccinations (7-18 months)", "Go to pediatrician well visit\nGo to vaccination visit", "Schedule pediatrician well visits\nSchedule vaccinations");
                    no_measures();
                    break;
                case "Doc well visits & vaccines (19 months - 3 years old)":
                    load("Pediatrician well visits and vaccinations (19 months - 3 years old)", "Go to pediatrician well visit\nGo to vaccination visit", "Schedule pediatrician well visits\nSchedule vaccinations");
                    no_measures();
                    break;
                case "Doc well visits & vaccines (4-6 years old)":
                    load("Pediatrician well visits and vaccinations (4-6 years old)", "Go to pediatrician well visit\nGo to vaccination visit", "Schedule pediatrician well visits\nSchedule vaccinations");
                    no_measures();
                    break;
                case "Doc well visits & vaccines (7-10 years old)":
                    load("Pediatrician well visits and vaccinations (7-10 years old)", "Go to pediatrician well visit\nGo to vaccination visit", "Schedule pediatrician well visits\nSchedule vaccinations");
                    no_measures();
                    break;
                case "Doc well visits & vaccines (11-14 years old)":
                    load("Pediatrician well visits and vaccinations (11-14 years old)", "Go to pediatrician well visit\nGo to vaccination visit", "Schedule pediatrician well visits\nSchedule vaccinations");
                    no_measures();
                    break;
                case "Doc well visits & vaccines (15-18 years old)":
                    load("Pediatrician well visits and vaccinations (15-18 years old)", "Go to pediatrician well visit\nGo to vaccination visit", "Schedule pediatrician well visits\nSchedule vaccinations");
                    no_measures();
                    break;
            // Dentist visits
                case "Dentist visits (0-6 months)":
                    load("Dentist visits (0-6 months)", "Go to dentist well visit", "Schedule dentist well visits");
                    no_measures();
                    break;
                case "Dentist visits (7-18 months)":
                    load("Dentist visits (7-18 months)", "Go to dentist well visit", "Schedule dentist well visits");
                    no_measures();
                    break;
                case "Dentist visits (19 months - 3 years old)":
                    load("Dentist visits (19 months - 3 years old)", "Go to dentist well visit", "Schedule dentist well visits");
                    no_measures();
                    break;
                case "Dentist visits (4-6 years old)":
                    load("Dentist visits (4-6 years old)", "Go to dentist well visit", "Schedule dentist well visits");
                    no_measures();
                    break;
                case "Dentist visits (7-10 years old)":
                    load("Dentist visits (7-10 years old)", "Go to dentist well visit", "Schedule dentist well visits");
                    no_measures();
                    break;
                case "Dentist visits (11-14 years old)":
                    load("Dentist visits (11-14 years old)", "Go to dentist well visit", "Schedule dentist well visits");
                    no_measures();
                    break;
      }
    });