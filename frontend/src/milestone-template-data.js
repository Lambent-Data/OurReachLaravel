/* An array containing all the template milestones and the associated goals and links.
 * This data will be stored in static tables in the database, but the structure of those tables
 * is still being developed. We may also change databases entirely.
 * Having the data in javascript will let us populate those tables more easily, for now, while we work out
 * the details.
 * 
 * The format of a milestone is as follows.
 *  {
 *    id: // Any unique string identifier for the milestone,
 *    category: // One of "Health", "Housing", "Children", "Jobs", "Money", "Education", and "Other". Any other value will default to "Other".
 *              // These values can be referenced using the "categories" master list.
 *    subcategory: // An object indicating the subcategory, as defined in subcategory lists below.
 *    name: // A string defining the name of the template milestone. The name must not be "Custom", as custom milestones are handled differently.
 *    sortOrder: // A number indicating the order that the template appears in the dropdown.
 * 
 *    links: // An array of objects of the form { url: "www.example.com", name: "An example link!" }. They define the suggested links that come with a milestone.
 * 
 *    measures: { // An object defining the measure type and options associated with the milestone. 
 *                type: // Either "dropdown", "freeform", or "none". Anything else defaults to "none".
 *        // If type is not "none", also include the following two:
 *                startLabel: // The prompt on the form offered for the starting measure field, e.g. "Where are you now on this milestone?"
 *                endLabel: // The prompt on the form offered for the ending measure field, e.g. "Where do you want to be when this milestone is done?"
 *                          // Try to keep these pretty short.
 *         // If type = "freeform", include these three:
 *                unit: // Optional: A string for the unit of the measure, e.g. "lb", "%", "mmHg"
 *                placeholderStartValue: // The greyed-out placeholder text in the input textbox for the starting measure,
 *                                       // before anything is written by the user, e.g. "Current status",
 *                placeholderEndValue: // The same for the ending measure, e.g. "End Status"
 *         // If type = "dropdown", include these four instead:
 *                startOptions: // Array of strings defining the options for the starting measure dropdown
 *                endOptions: // Array of strings defining the options for the ending measure dropdown.
 *                            // NOTE! If these are the same as the start options, they can be omitted.
 *                defaultStart: // A string for the default value in the starting measure dropdown. If it is present in startOptions, then that one will be autoselected.
 *                              // Otherwise, it will act like a placeholder, e.g. "Choose an option", and won't be selectable
 *                defaultEnd: // The analogous field for the ending options
 *              },
 * 
 *    goals: [// An array of goal objects, which are as follows:
 *             {
 *               name: // A string defining the goal name
 *               type: // "one-time", "daily", "weekly", "monthly", or "yearly". See goalBasis.
 *           // Then there are different options depending on type.
 *           // MOST OF THESE DO NOT NEED TO BE FILLED IN JUST NOW. Stick with name and type, unless you really want to fill out more.
 *           // If type = "one-time":
 *               deadline: // Presumably, no need to set a default deadline, so skip this field.
 *           // If type = "daily":
 *               frequency: // Positive integer number of days between repetitions. E.g. 1 would repeat every day, 2 every other day, etc.
 *               times: // A non-empty array of times of day, expressed in seconds since midnight, e.g. 12:00 noon would be 12*60*60.
 *           // If type = "weekly":
 *               days: { // An object mapping days to arrays of times, just as above. The days of the week are listed in the days variable. It's fine to omit days entirely.
 *                 mon : [13*60*60, 18*60*60], // An example
 *                 tue : [], // No times listed on Tuesday, same as not including Tuesday at all
 *                 fri : [16*60*60],
 *               }
 *           // If type = "monthly":
 *                monthly : // An array of numbers between 1 and 31, identifying days of the month (we'll expand this later). E.g. [1, 5, 10] for the first, fifth, and tenth of each month.
  *             }
 *           ],
 *  }
 *
 */

/* A list of categories, for consistent referencing. This does not need to change for the foreseeable future. */
const categories = {
  health: "Health",
  housing: "Housing",
  children: "Children",
  jobs: "Jobs",
  money: "Money",
  education: "Education",
  other: "Other",
};

/* A list of subcategories within Health. Add subcategories as needed.
 * We want the Subcategory field in the db to be consistent, so we always
 * refer to these master lists of subcategories in the templates. 
 * 
 * There must not be a "Custom" subcategory, as the custom ones are handled differently.
 * 
 * The key (e.g. main) is just used for easy referencing within this file.
 * The id field should be a unique numerical identifier among all health subcategories.
 * The name field is the string that will appear to the user.
 * The sortOrder field determines the order of these subcategories in the dropdown.
 */

const healthSubcategories = {
  main: { id: 0, name: "Main", sortOrder: 1 },
  mental: { id: 1, name: "Mental Health", sortOrder: 2 },
  custom: { id: 99, name: "Custom", sortOrder: 99 },
};

/* Similar lists for all other categories. */
const housingSubcategories = {
  emergency: { id: 0, name: "Emergency Shelter", sortOrder: 1 },
  transitional: { id: 1, name: "Transitional Housing", sortOrder: 2 },
  current: { id: 2, name: "Stay in current home", sortOrder: 3 },
  permanent: { id: 3, name: "Permanent Housing", sortOrder: 4 },
  custom: { id: 99, name: "Custom", sortOrder: 99 },
};
const childrenSubcategories = {
  prenatal: { id: 0, name: "Prenatal Specific", sortOrder: 1 },
  birth: { id: 1, name: "From Birth Onward", sortOrder: 2 },
  pediatrician: { id: 2, name: "Pediatrician well visits and vaccinations", sortOrder: 3 },
  dentist: { id: 3, name: "Dentist visits", sortOrder: 4 },
  custom: { id: 99, name: "Custom", sortOrder: 99 },
};
const jobsSubcategories = {
  location: { id: 0, name: "Location", sortOrder: 1 },
  income: { id: 1, name: "Income & Benefits", sortOrder: 2 },
  schedule: { id: 2, name: "Schedule", sortOrder: 3 },
  enjoyment: { id: 3, name: "Enjoyment", sortOrder: 4 },
  custom: { id: 99, name: "Custom", sortOrder: 99 },
};
const moneySubcategories = {
  budgeting: { id: 0, name: "Budgeting", sortOrder: 1 },
  personal: { id: 1, name: "Personal Finance", sortOrder: 2 },
  programs: { id: 2, name: "Income Programs", sortOrder: 3 },
  custom: { id: 99, name: "Custom", sortOrder: 99 },
};
const educationSubcategories = {
  level: { id: 0, name: "Education Level", sortOrder: 1 },
  location: { id: 1, name: "Location", sortOrder: 2 },
  schedule: { id: 2, name: "Schedule", sortOrder: 3 },
  satisfaction: { id: 3, name: "Satisfaction", sortOrder: 4 },
  custom: { id: 99, name: "Custom", sortOrder: 99 },
};
const otherSubcategories = {
  program: { id: 0, name: "Provider Specific", sortOrder: 1 },
  custom: { id: 99, name: "Custom", sortOrder: 99 },
};


/* Repetition basis options for goals */
const goalBasis = {
  once: "one-time",
  daily: "daily",
  weekly: "weekly",
  monthly: "monthly",
  yearly: "yearly"
};

/* Measure types */
const measureData = {
  freeform: "freeform",
  dropdown: "dropdown",
  none: "none",
};

const optionLists = {
  shelterOptions: [
    "Living on street",
    "Traditional shelter",
    "Volunteer group shelter",
    "Faith congregation",
  ],
  rapidRehousingOptions: [
    "Living on street",
    "Traditional shelter",
    "Volunteer group shelter",
    "Faith congregation",
    "Rapid Rehousing program",
  ],
  transitionalHousingOptions: [
    "Living on street",
    "Traditional shelter",
    "Volunteer group shelter",
    "Faith congregation",
    "Transitional housing",
  ],
  educationLevelsHighSchool: [
    "Some high school completed",
    "High school diploma",
  ],
  educationLevelsGED: [
    "Some high school completed",
    "GED",
  ],
  educationLevelsAssociates: [
    "Some high school completed",
    "GED",
    "High school diploma",
    "Trade/technical/vocational training",
    "Military with related training",
    "Associate's degree",
  ],
  educationLevelsBachelors: [
    "Some high school completed",
    "GED",
    "High school diploma",
    "Trade/technical/vocational training",
    "Associate's degree",
    "Military with related training",
    "Bachelor's degree",
  ],
  educationLevelsMilitary: [
    "Some high school completed",
    "GED",
    "High school diploma",
    "Trade/technical/vocational training",
    "Associate's degree",
    "Bachelor's degree",
    "Military with related training",
  ],
  educationLevelsTraining: [
    "Some high school completed",
    "GED",
    "High school diploma",
    "Associate's degree",
    "Bachelor's degree",
    "Military with related training",
    "Trade/technical/vocational training",
  ],
  educationLevelsPostgraduate: [
    "Some high school completed",
    "GED",
    "High school diploma",
    "Trade/technical/vocational training",
    "Associate's degree",
    "Bachelor's degree",
    "Military with related training",
    "Postgraduate title",
  ],
  educationEnjoymentSomewhat: [
    "Workload not manageable",
    "Workload somewhat manageable",
  ],
  educationEnjoymentFully: [
    "Workload not manageable",
    "Workload somewhat manageable",
    "Workload fully manageable",
  ],
  peaceLevelOptions: [
    "1 (low)",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10 (high)",
  ]
};

const templateData = [

  /* Start of Health Milestones*/
  {
    id: "preventive care",
    category: categories.health,
    subcategory: healthSubcategories.main,
    name: "Preventive care for this calendar year",
    sortOrder: 1,
    links: [
      { url: "", name: "" },
    ],
    measures: {
      type: measureData.none,
    },
    goals: [
      {
        name: "Schedule annual physical",
        description: "Call several months in advance to schedule my annual checkup, to make sure I have no underlying health issues or to address those quickly.",
        type: goalBasis.yearly,
      },
      {
        name: "Visit doctor for Annual Physical",
        description: "To make sure I have no underlying health issues or to address those quickly, an annual checkup is necessary.",
        type: goalBasis.once,
      },
      {
        name: "Schedule dentist visit for cleaning & check-up",
        description: "Call several months in advance to schedule my regular dentist cleaning and checkup. Good dental care helps with teeth, my smile, and other health issues.",
        type: goalBasis.daily,
        frequency: 180,
      },
      {
        name: "Visit dentist for cleaning & check-up",
        description: "Good dental care helps with teeth, my smile, and other health issues.",
        type: goalBasis.daily,
        frequency: 180,
      },
      {
        name: "Enroll in a stop smoking program",
        type: goalBasis.once,
      },
      {
        name: "Schedule mammogram",
        type: goalBasis.once,
      },
      {
        name: "Have mammogram",
        type: goalBasis.once,
      },
      {
        name: "Discuss contraceptive options with OB",
        type: goalBasis.once,
      },
      {
        name: "Take contraceptive",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Choose not to smoke today",
        type: goalBasis.daily,
      },
    ],
  },

  {
    id: "HbA1c",
    category: categories.health,
    subcategory: healthSubcategories.main,
    name: "Reach target HbA1c level",
    sortOrder: 2,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=93", name: "Diabetes" },
    ],
    measures: {
      type: measureData.freeform,
      startLabel: "What is your current HbA1c level?",
      endLabel: "What is your HbA1c goal?",
      unit: "%",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Ask family and friend(s) to support healthy food choices",
        description: "Adapting to a healthier lifestyle is easier with supportive friends and family.",
        type: goalBasis.once
      },
      {
        name: "Sign up for nutrition plan",
        description: "A nutrition plan provide control over my diet and promotes a healthier lifestyle.",
        type: goalBasis.once,
      },
      {
        name: "Sign up for exercise plan",
        description: "An exercise plan will give me a consistent workout routine that will improve my health.",
        type: goalBasis.once,
      },
      {
        name: "Research places to buy discounted fruits and vegetables",
        description: "Places to buy discounted fruits and vegetables will help me improve my diet and health in a way that is affordable.",
        type: goalBasis.once,
      },
      {
        name: "Talk with family or friend(s) about diabetes",
        description: "Supportive family or friends can help me manage my diabetes.",
        type: goalBasis.once,
      },
      {
        name: "Attend diabetes support group",
        description: "A diabetes support group improves members' quality of life and can provide self-management tips.",
        type: goalBasis.once,
      },
      {
        name: "Schedule an eye exam",
        description: "Eye exams can check the health of my eyes and aid vision correction.",
        type: goalBasis.once,
      },
      {
        name: "Walk/Exercise for 30 minutes today",
        description: "Exercising is essential for the human body. Walking for 30 minutes a day can prevent serious health issues.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Drink less alcohol",
        description: "Drinking alcohol can lead to regretful decisions and liver problems. If I am pregnant, alcohol can damage my unborn baby. Alcoholic drinks also contain \"empty calories.\" Finding substitutes provides a healthier alternative to alcohol.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Sleep at least 6 hours total tonight",
        description: "Sleeping a satisfactory amount can lead to a sharper brain, a mood boost, and a healthier heart.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Take prescribed medication in AM",
        description: "Taking prescribed medication on time is important for treating temporary conditions, controlling chronic conditions, and overall long-term health.",
        type: goalBasis.daily,
        frequency: 1, // Every day (this is the alterntive condensed version)
        times: [12 * 60 * 60], // before noon
      },
      {
        name: "Take prescribed medication in PM",
        description: "Taking prescribed medication on time is important for treating temporary conditions, controlling chronic conditions, and overall long-term health.",
        type: goalBasis.daily,
        frequency: 1, // Every day (this is the alterntive condensed version)
        times: [24 * 60 * 60], // before midnight
      },
      {
        name: "Drink 6 glasses of water",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Eat 6 servings of fruits/vegetables today",
        description: "Fruits and vegetables are a good source for vitamins and minerals and contribute to a healthy balanced diet. They also help reduce my risk of heart disease and some cancers.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Write in my gratitude journal",
        description: "Writing in a Gratitude Journal improves positivity, self-esteem, reduces stress, and helps me sleep better.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Meditate/Do deep breathing",
        description: "Meditating and deep breathing lowers stress levels, heart rate, and blood pressure.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Check blood sugar levels according to doctor",
        description: "To prevent emergencies & other long-term difficulties, I must take measures to keep blood sugar levels normal.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Check feet daily",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Plan 5 healthy recipies to cook this week",
        description: "A healthier lifestyle improves mental health and overall health. Cooking instead of buying meals can also save money.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-62&redirect_to=subentity&gotopage[1137]=1", name: "Cooking" },
        ],
        type: goalBasis.weekly,
        days: {
          sun: [12 * 60 * 60],
        }
      },
      {
        name: "Make weekly shopping list for healthy meals",
        type: goalBasis.weekly,
        days: {
          sun: [12 * 60 * 60],
        }
      },
      {
        name: "Go grocery shopping",
        type: goalBasis.weekly,
        days: {
          sun: [12 * 60 * 60],
        }
      },
      {
        name: "Monthly weight check",
        description: "Weighing myself regularly can help reach goals of weight loss, gain, or maintenance. It can also help detect other health issues.",
        type: goalBasis.monthly,
        days: [28]
      },
    ],
  },

  {
    id: "blood sugar",
    category: categories.health,
    subcategory: healthSubcategories.main,
    name: "Reach target blood sugar level",
    sortOrder: 3,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=93", name: "Diabetes" },
    ],
    measures: { // Freeform example
      type: measureData.freeform,
      startLabel: "What is your current blood sugar level?",
      endLabel: "What is your blood sugar goal?",
      unit: "mg/dL",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Ask family and friend(s) to support healthy food choices",
        description: "Adapting to a healthier lifestyle is easier with supportive friends and family.",
        type: goalBasis.once
      },
      {
        name: "Sign up for nutition plan",
        type: goalBasis.once
      },
      {
        name: "Sign up for exercise plan",
        description: "An exercise plan will give me a consistent workout routine that will improve my health.",
        type: goalBasis.once
      },
      {
        name: "Talk with family or friend(s) about diabetes",
        description: "Supportive family or friends can help me manage my diabetes.",
        type: goalBasis.once
      },
      {
        name: "Schedule an eye exam",
        description: "Eye exams can check the health of my eyes and aid vision correction.",
        type: goalBasis.once
      },
      {
        name: "Go to eye exam",
        description: "Eye exams can check the health of my eyes and aid vision correction.",
        type: goalBasis.once
      },
      {
        name: "Walk/Exercise for 30 minutes today",
        description: "Exercising is essential for the human body. Walking for 30 minutes a day can prevent serious health issues.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Take prescribed medication in AM",
        description: "Taking prescribed medication on time is important for treating temporary conditions, controlling chronic conditions, and overall long-term health.",
        type: goalBasis.daily,
        frequency: 1, // Every day (this is the alterntive condensed version)
        times: [12 * 60 * 60], // before noon
      },
      {
        name: "Take prescribed medication in PM",
        description: "Taking prescribed medication on time is important for treating temporary conditions, controlling chronic conditions, and overall long-term health.",
        type: goalBasis.daily,
        frequency: 1, // Every day (this is the alterntive condensed version)
        times: [24 * 60 * 60], // before midnight
      },
      {
        name: "Drink less alcohol",
        description: "Drinking alcohol can lead to regretful decisions and liver problems. If I am pregnant, alcohol can damage my unborn baby. Alcoholic drinks also contain \"empty calories.\" Finding substitutes provides a healthier alternative to alcohol.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Sleep at least 6 hours total tonight",
        description: "Sleeping a satisfactory amount can lead to a sharper brain, a mood boost, and a healthier heart.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Eat 6 servings of fruits/vegetables today",
        description: "Fruits and vegetables are a good source for vitamins and minerals and contribute to a healthy balanced diet. They also help reduce my risk of heart disease and some cancers.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Write in my gratitude journal",
        description: "Writing in a Gratitude Journal improves positivity, self-esteem, reduces stress, and helps me sleep better.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Meditate/Do deep breathing",
        description: "Meditating and deep breathing lowers stress levels, heart rate, and blood pressure.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Check blood sugar levels according to doctor",
        description: "To prevent emergencies & other long-term difficulties, I must take measures to keep blood sugar levels normal.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Check feet daily",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Plan 5 healthy recipies to cook this week",
        description: "A healthier lifestyle improves mental health and overall health. Cooking instead of buying meals can also save money.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-62&redirect_to=subentity&gotopage[1137]=1", name: "Cooking" },
        ],
        type: goalBasis.weekly,
        days: {
          sun: [12 * 60 * 60],
        }
      },
      {
        name: "Monthly weight check",
        description: "Weighing myself regularly can help reach goals of weight loss, gain, or maintenance. It can also help detect other health issues.",
        type: goalBasis.monthly,
        days: [28]
      },
      {
        name: "Attend diabetes support group",
        description: "A diabetes support group improves members' quality of life and can provide self-management tips.",
        type: goalBasis.monthly,
        days: [28]
      },
    ],
  },

  {
    id: "blood pressure",
    category: categories.health,
    subcategory: healthSubcategories.main,
    name: "Reach target blood pressure level",
    sortOrder: 4,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=93", name: "Diabetes" },
    ],
    measures: { // Freeform example
      type: measureData.freeform,
      startLabel: "What is your current blood pressure level?",
      endLabel: "What is your blood pressure goal?",
      unit: "mmHg",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Ask family and friend(s) to support healthy food choices",
        description: "Adapting to a healthier lifestyle is easier with supportive friends and family.",
        type: goalBasis.once
      },
      {
        name: "Sign up for nutition plan",
        type: goalBasis.once
      },
      {
        name: "Sign up for exercise plan",
        description: "An exercise plan will give me a consistent workout routine that will improve my health.",
        type: goalBasis.once
      },
      {
        name: "Talk with family or friend(s) about hypertension",
        description: "Supportive family or friends can help me manage my hypertension by aiding my lifestyle and diet changes.",
        type: goalBasis.once
      },
      {
        name: "Schedule an eye exam",
        description: "Eye exams can check the health of my eyes and aid vision correction.",
        type: goalBasis.once
      },
      {
        name: "Go to eye exam",
        description: "Eye exams can check the health of my eyes and aid vision correction.",
        type: goalBasis.once
      },
      {
        name: "Walk/Exercise for 30 minutes today",
        description: "Exercising is essential for the human body. Walking for 30 minutes a day can prevent serious health issues.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Take prescribed medication in AM",
        description: "Taking prescribed medication on time is important for treating temporary conditions, controlling chronic conditions, and overall long-term health.",
        type: goalBasis.daily,
        frequency: 1, // Every day (this is the alterntive condensed version)
        times: [12 * 60 * 60], // before noon
      },
      {
        name: "Take prescribed medication in PM",
        description: "Taking prescribed medication on time is important for treating temporary conditions, controlling chronic conditions, and overall long-term health.",
        type: goalBasis.daily,
        frequency: 1, // Every day (this is the alterntive condensed version)
        times: [24 * 60 * 60], // before midnight
      },
      {
        name: "Drink less alcohol",
        description: "Drinking alcohol can lead to regretful decisions and liver problems. If I am pregnant, alcohol can damage my unborn baby. Alcoholic drinks also contain \"empty calories.\" Finding substitutes provides a healthier alternative to alcohol.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Sleep at least 6 hours total tonight",
        description: "Sleeping a satisfactory amount can lead to a sharper brain, a mood boost, and a healthier heart.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Take aspirin as reccomended by doctor",
        type: goalBasis.daily,
      },
      {
        name: "Eat 6 servings of fruits/vegetables today",
        description: "Fruits and vegetables are a good source for vitamins and minerals and contribute to a healthy balanced diet. They also help reduce my risk of heart disease and some cancers.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Write in my gratitude journal",
        description: "Writing in a Gratitude Journal improves positivity, self-esteem, reduces stress, and helps me sleep better.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Meditate/Do deep breathing",
        description: "Meditating and deep breathing lowers stress levels, heart rate, and blood pressure.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Check blood pressure levels according to doctor",
        description: "To prevent emergencies & other long-term difficulties, I must take measures to keep blood sugar levels normal.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Check feet daily",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Plan 5 healthy recipies to cook this week",
        description: "A healthier lifestyle improves mental health and overall health. Cooking instead of buying meals can also save money.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-62&redirect_to=subentity&gotopage[1137]=1", name: "Cooking" },
        ],
        type: goalBasis.weekly,
        days: {
          sun: [12 * 60 * 60],
        }
      },
      {
        name: "Monthly weight check",
        description: "Weighing myself regularly can help reach goals of weight loss, gain, or maintenance. It can also help detect other health issues.",
        type: goalBasis.monthly,
        days: [28]
      },
      {
        name: "Attend hypertension support group",
        type: goalBasis.monthly,
        days: [28]
      },
    ],
  },

  {
    id: "weight",
    category: categories.health,
    subcategory: healthSubcategories.main,
    name: "Reach target weight level",
    sortOrder: 5,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=62", name: "Nutrition" },
      { url: "ourreach/index.php?module=ext/ipages/view&id=76", name: "Exercise & Sleep" },
    ],
    measures: {
      type: measureData.freeform,
      startLabel: "What is your current weight?",
      endLabel: "What is your weight goal?",
      unit: "lbs",
      placeholderStartValue: "___",
      placeholderEndValue: "___",
    },
    goals: [
      {
        name: "Ask family and friend(s) to support healthy food choices",
        description: "Adapting to a healthier lifestyle is easier with supportive friends and family.",
        type: goalBasis.once
      },
      {
        name: "Sign up for nutition plan",
        type: goalBasis.once
      },
      {
        name: "Sign up for exercise plan",
        description: "An exercise plan will give me a consistent workout routine that will improve my health.",
        type: goalBasis.once
      },
      {
        name: "Walk/Exercise for 30 minutes today",
        description: "Exercising is essential for the human body. Walking for 30 minutes a day can prevent serious health issues.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Take prescribed medication in AM",
        description: "Taking prescribed medication on time is important for treating temporary conditions, controlling chronic conditions, and overall long-term health.",
        type: goalBasis.daily,
        frequency: 1, // Every day (this is the alterntive condensed version)
        times: [12 * 60 * 60], // before noon
      },
      {
        name: "Take prescribed medication in PM",
        description: "Taking prescribed medication on time is important for treating temporary conditions, controlling chronic conditions, and overall long-term health.",
        type: goalBasis.daily,
        frequency: 1, // Every day (this is the alterntive condensed version)
        times: [24 * 60 * 60], // before midnight
      },
      {
        name: "Drink less alcohol",
        description: "Drinking alcohol can lead to regretful decisions and liver problems. If I am pregnant, alcohol can damage my unborn baby. Alcoholic drinks also contain \"empty calories.\" Finding substitutes provides a healthier alternative to alcohol.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Look up a new healthy recipe",
        description: "A healthier lifestyle improves mental health and overall health. Cooking instead of buying meals can also save money.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Sleep at least 6 hours total tonight",
        description: "Sleeping a satisfactory amount can lead to a sharper brain, a mood boost, and a healthier heart.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Eat 6 servings of fruits/vegetables today",
        description: "Fruits and vegetables are a good source for vitamins and minerals and contribute to a healthy balanced diet. They also help reduce my risk of heart disease and some cancers.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Write in my gratitude journal",
        description: "Writing in a Gratitude Journal improves positivity, self-esteem, reduces stress, and helps me sleep better.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Meditate/Do deep breathing",
        description: "Meditating and deep breathing lowers stress levels, heart rate, and blood pressure.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Take a break from social media",
        description: "Designating a specific amount of time away from social media allows me to destress and become more productive.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Drink water instead of soda or juice",
        description: "Drinking water helps maximize physical performance, improve my energy levels and brain function, and can help prevent headaches. Also, water does not have calories, so drinking water instead of soda or juice can help control weight.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Eat 3 meals a day",
        description: "Eating 3 meals a day helps to maintain a healthy weight and to enjoy quality meals to get essential vitamins and minerals.",
        type: goalBasis.daily,
        frequency: 1,
        times: [8 * 60 * 60, 12 * 60 * 60, 18 * 60 * 60],
      },
      {
        name: "Plan 5 healthy recipies to cook this week",
        description: "A healthier lifestyle improves mental health and overall health. Cooking instead of buying meals can also save money.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-62&redirect_to=subentity&gotopage[1137]=1", name: "Cooking" },
        ],
        type: goalBasis.weekly,
        days: {
          sun: [12 * 60 * 60],
        }
      },
      {
        name: "Monthly weight check",
        description: "Weighing myself regularly can help reach goals of weight loss, gain, or maintenance. It can also help detect other health issues.",
        type: goalBasis.monthly,
        days: [28]
      },
    ],
  },

  {
    id: "BMI",
    category: categories.health,
    subcategory: healthSubcategories.main,
    name: "Reach target BMI",
    sortOrder: 6,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=62", name: "Nutrition" },
      { url: "ourreach/index.php?module=ext/ipages/view&id=76", name: "Exercise & Sleep" },
    ],
    measures: {
      type: measureData.freeform,
      startLabel: "What is your current BMI?",
      endLabel: "What is your BMI goal?",
      unit: "",
      placeholderStartValue: "___",
      placeholderEndValue: "___",
    },
    goals: [
      {
        name: "Ask family and friend(s) to support healthy food choices",
        description: "Adapting to a healthier lifestyle is easier with supportive friends and family.",
        type: goalBasis.once
      },
      {
        name: "Sign up for nutition plan",
        type: goalBasis.once
      },
      {
        name: "Sign up for exercise plan",
        description: "An exercise plan will give me a consistent workout routine that will improve my health.",
        type: goalBasis.once
      },
      {
        name: "Walk/Exercise for 30 minutes today",
        description: "Exercising is essential for the human body. Walking for 30 minutes a day can prevent serious health issues.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Take prescribed medication in AM",
        description: "Taking prescribed medication on time is important for treating temporary conditions, controlling chronic conditions, and overall long-term health.",
        type: goalBasis.daily,
        frequency: 1, // Every day (this is the alterntive condensed version)
        times: [12 * 60 * 60], // before noon
      },
      {
        name: "Take prescribed medication in PM",
        description: "Taking prescribed medication on time is important for treating temporary conditions, controlling chronic conditions, and overall long-term health.",
        type: goalBasis.daily,
        frequency: 1, // Every day (this is the alterntive condensed version)
        times: [24 * 60 * 60], // before midnight
      },
      {
        name: "Drink less alcohol",
        description: "Drinking alcohol can lead to regretful decisions and liver problems. If I am pregnant, alcohol can damage my unborn baby. Alcoholic drinks also contain \"empty calories.\" Finding substitutes provides a healthier alternative to alcohol.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Look up a new healthy recipe",
        description: "A healthier lifestyle improves mental health and overall health. Cooking instead of buying meals can also save money.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-62&redirect_to=subentity&gotopage[1137]=1", name: "Cooking" },
        ],
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Sleep at least 6 hours total tonight",
        description: "Sleeping a satisfactory amount can lead to a sharper brain, a mood boost, and a healthier heart.",
        type: goalBasis.daily,
      },
      {
        name: "Eat 6 servings of fruits/vegetables today",
        description: "Fruits and vegetables are a good source for vitamins and minerals and contribute to a healthy balanced diet. They also help reduce my risk of heart disease and some cancers.",
        type: goalBasis.daily,
      },
      {
        name: "Write in my gratitude journal",
        description: "Writing in a Gratitude Journal improves positivity, self-esteem, reduces stress, and helps me sleep better.",
        type: goalBasis.daily,
      },
      {
        name: "Meditate/Do deep breathing",
        description: "Meditating and deep breathing lowers stress levels, heart rate, and blood pressure.",
        type: goalBasis.daily,
      },
      {
        name: "Take a break from social media",
        description: "Designating a specific amount of time away from social media allows me to destress and become more productive.",
        type: goalBasis.daily,
      },
      {
        name: "Drink water instead of soda or juice",
        description: "Drinking water helps maximize physical performance, improve my energy levels and brain function, and can help prevent headaches. Also, water does not have calories, so drinking water instead of soda or juice can help control weight.",
        type: goalBasis.daily,
      },
      {
        name: "Eat 3 meals a day",
        description: "Eating 3 meals a day helps to maintain a healthy weight and to enjoy quality meals to get essential vitamins and minerals.",
        type: goalBasis.daily,
        frequency: 1,
        times: [8 * 60 * 60, 12 * 60 * 60, 18 * 60 * 60],
      },
      {
        name: "Plan 5 healthy recipies to cook this week",
        description: "A healthier lifestyle improves mental health and overall health. Cooking instead of buying meals can also save money.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-62&redirect_to=subentity&gotopage[1137]=1", name: "Cooking" },
        ],
        type: goalBasis.weekly,
        days: {
          sun: [12 * 60 * 60],
        }
      },
      {
        name: "Monthly weight check",
        description: "Weighing myself regularly can help reach goals of weight loss, gain, or maintenance. It can also help detect other health issues.",
        type: goalBasis.monthly,
        days: [28]
      },
    ],
  },

  {
    id: "peace",
    category: categories.health,
    subcategory: healthSubcategories.mental,
    name: "Reach desired level of day-to-day peacefulness",
    sortOrder: 1,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=22", name: "Mental Health" },
    ],
    measures: {
      type: measureData.dropdown,
      startLabel: "What is your current peace level?",
      endLabel: "What is your target peace level?",
      startOptions: optionLists.peaceLevelOptions,
      // endOptions can be omitted because start and end options are the same
      defaultStart: "Select Peace Level (1 is low, 10 is high)",
      defaultEnd: "Select Peace Level (1 is low, 10 is high)",
    },
    goals: [
      {
        name: "Find therapist or psychiatrist covered by health insurance",
        description: "A therapist or psychiatrist covered by my health insurance can help me with stress, anxiety, and how to make healthy changes to my life.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-54&action=download_attachment&preview=1&file=MTYyNzM4OTY5Ml9VbmhlYWx0aHlfSGVhbHRoeV9TaWduc18oMSkucGRm", name: "Unhealthy Relationship Signs" },
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-60&redirect_to=subentity&gotopage[1137]=1", name: "Relationships" },
        ],
        type: goalBasis.once
      },
      {
        name: "Ask family or friends to support mental health choices",
        description: "It is important to have encouragement and support from family members when making lifestyle changes for my mental health.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-54&action=download_attachment&preview=1&file=MTYyNzM4OTY5Ml9VbmhlYWx0aHlfSGVhbHRoeV9TaWduc18oMSkucGRm", name: "Unhealthy Relationship Signs" },
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-60&redirect_to=subentity&gotopage[1137]=1", name: "Relationships" },
        ],
        type: goalBasis.once
      },
      {
        name: "Set screen time limit for social media",
        description: "Limiting screen time improves mood and encourages physical and social development.",
        type: goalBasis.once
      },
      {
        name: "Write in gratitude journal",
        description: "Writing in a Gratitude Journal improves positivity, self-esteem, reduces stress, and helps me sleep better.",
        type: goalBasis.daily
      },
      {
        name: "Meditate/Do deep breathing for at least 60 seconds",
        description: "Meditating and deep breathing lowers stress levels, heart rate, and blood pressure. It can also foster calm and control.",
        type: goalBasis.daily
      },
      {
        name: "Pray",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-58&redirect_to=subentity&gotopage[1137]=1", name: "Virtual Camp Leader Devotionals: Day 1" },
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-59&redirect_to=subentity&gotopage[1137]=1", name: "Virtual Camp Leader Devotionals: Day 2" },
        ],
        type: goalBasis.daily
      },
      {
        name: "Take a break from social media",
        description: "Taking a break from social media can improve my overall mood,  allow me to reconnect with the real world, and gain a lot of free time.",
        type: goalBasis.daily
      },
      {
        name: "Take prescribed mental health medication",
        description: "Mental health medication can reduce the chemical imbalances in a person's brain and reduce symptoms.",
        type: goalBasis.daily
      },
      {
        name: "Go for a walk",
        description: "Walking strengthens muscles, improves circulation, and can help my mood.",
        type: goalBasis.daily
      },
      {
        name: "Talk with a friend or family member about challenges and/or joys",
        description: "Finding time to sit with family members allows for better relationships.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-54&action=download_attachment&preview=1&file=MTYyNzM4OTY5Ml9VbmhlYWx0aHlfSGVhbHRoeV9TaWduc18oMSkucGRm", name: "Unhealthy Relationship Signs" },
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-60&redirect_to=subentity&gotopage[1137]=1", name: "Relationships" },
        ],
        type: goalBasis.weekly
      },
      {
        name: "Practice handling a stressful situation",
        description: "Practicing handling a stressful situation like an upcoming difficult conversation will give me more confidence and reduce stress when handling it.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-54&action=download_attachment&preview=1&file=MTYyNzM4OTY5Ml9VbmhlYWx0aHlfSGVhbHRoeV9TaWduc18oMSkucGRm", name: "Unhealthy Relationship Signs" },
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-60&redirect_to=subentity&gotopage[1137]=1", name: "Relationships" },
        ],
        type: goalBasis.weekly
      },
      {
        name: "Go to one-on-one therapy session",
        description: "One-on-one therapy adds to my support network, helps manage symptoms, and facilitate lifestyle changes.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-54&action=download_attachment&preview=1&file=MTYyNzM4OTY5Ml9VbmhlYWx0aHlfSGVhbHRoeV9TaWduc18oMSkucGRm", name: "Unhealthy Relationship Signs" },
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-60&redirect_to=subentity&gotopage[1137]=1", name: "Relationships" },
        ],
        type: goalBasis.weekly
      },
      {
        name: "Go to family/couples therapy sessions",
        description: "Family/couple therapy improves family dynamics and relationships.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-54&action=download_attachment&preview=1&file=MTYyNzM4OTY5Ml9VbmhlYWx0aHlfSGVhbHRoeV9TaWduc18oMSkucGRm", name: "Unhealthy Relationship Signs" },
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-60&redirect_to=subentity&gotopage[1137]=1", name: "Relationships" },
        ],
        type: goalBasis.weekly
      },
      {
        name: "Read the Bible",
        description: "Reading the Bible gives wisdom, hope, and strengthens faith.",
        type: goalBasis.weekly
      },
      {
        name: "Read a chapter of a book by my favourite author",
        description: "Reading a chapter of a favorite book can reduce stress, improve brain-power, and enable me to sleep better.",
        type: goalBasis.weekly
      },
      {
        name: "Participate in faith congregation services",
        description: "Participating in faith congregation services helps build faith and community and is an opportunity to give back.",
        type: goalBasis.weekly
      },
      {
        name: "Listen to inspiring music",
        description: "Listening to inspiring music can reduce stress, anxiety, and improves mood.",
        type: goalBasis.weekly
      },
      {
        name: "Listen to worship music",
        description: "Worship music promotes faith, soothes the body, and improves mental health.",
        type: goalBasis.weekly
      },

      {
        name: "Attend group support meetings",
        description: "Support groups can give encouragement and self-care tips.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-54&action=download_attachment&preview=1&file=MTYyNzM4OTY5Ml9VbmhlYWx0aHlfSGVhbHRoeV9TaWduc18oMSkucGRm", name: "Unhealthy Relationship Signs" },
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-60&redirect_to=subentity&gotopage[1137]=1", name: "Relationships" },
        ],
        type: goalBasis.monthly
      },
    ],
  },

  /* Start of Housing Milestones*/

  {
    id: "faith shelter",
    category: categories.housing,
    subcategory: housingSubcategories.emergency,
    name: "Move to shelter through faith congregation",
    sortOrder: 1,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=24", name: "Emergency Shelter-Transitional Housing" },
    ],
    measures: { // Dropdown example
      type: measureData.dropdown,
      startLabel: "What is your living situation now?",
      endLabel: "What living situation are you aiming for?",
      startOptions: optionLists.shelterOptions,
      // endOptions can be omitted because start and end options are the same
      defaultStart: "Living on street",
      defaultEnd: "Faith Congregation",
    },
    goals: [
      {
        name: "Gather my belongings to take to the shelter",
        description: "It is important to have and keep track of my necessary belongings when changing locations.",
        type: goalBasis.once,
      },
      {
        name: "Calculate housing budget",
        description: "Calculating my housing budget will help me decide where I can live that fits my needs.",
        type: goalBasis.once,
      },
      {
        name: "Check Provider's Corner for emergency housing options",
        description: "The Provider's Corner can lead me to resources that can be used when in need of emergency housing.",
        type: goalBasis.once,
      },
      {
        name: "Research and locate appropriate shelter",
        description: "Appropriate shelters depend on my needs, my location, and the organization's availability.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=24#First_Sub_Point_2", name: "Examples of Emergency Shelters" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Join Facebook housing groups",
        description: "Facebook housing groups can help me find a new home within my budget and needs.",
        type: goalBasis.once,
      },
      {
        name: "Ask church leaders for support and guidance",
        description: "Church leaders can give encouragement during hard times and support me in my next steps. ",
        type: goalBasis.once,
      },
      {
        name: "Call my local help hotline",
        description: "The ability to know when and where to seek for help is crucial. A help hotline may provide the support that family and friends cannot.",
        type: goalBasis.once,
      },

      {
        name: "Tell friends and family where I am",
        description: "It is important to let my friends and family know of my location and safety.",
        type: goalBasis.daily,
      },
      {
        name: "Make a daily account of all my belongings",
        description: "Making a daily account of all belongings can reduce stress, save time, and improve productivity. It will also help keep track of these when in the shelter.",
        type: goalBasis.daily,
      },

      {
        name: "Visit my local food bank",
        description: "Food banks provide me with food that my family and I need.",
        type: goalBasis.weekly,
      },
      {
        name: "Call friends and family",
        description: "Calling friends and family is a means of self-care to help me and my loved ones feel less isolated.",
        type: goalBasis.daily,
        frequency: 3,
      },
    ],
  },

  {
    id: "volunteer shelter",
    category: categories.housing,
    subcategory: housingSubcategories.emergency,
    name: "Move to shelter through other volunteer group",
    sortOrder: 2,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=24", name: "Emergency Shelter-Transitional Housing" },
    ],
    measures: {
      type: measureData.dropdown,
      startLabel: "What is your living situation now?",
      endLabel: "What living situation are you aiming for?",
      startOptions: optionLists.shelterOptions,
      // endOptions can be omitted because start and end options are the same
      defaultStart: "Living on street",
      defaultEnd: "Volunteer group shelter",
    },
    goals: [
      {
        name: "Gather my belongings to take to the shelter",
        description: "It is important to have and keep track of my necessary belongings when changing locations.",
        type: goalBasis.once,
      },
      {
        name: "Calculate housing budget",
        description: "Calculating my housing budget will help me decide where I can live that fits my needs.",
        type: goalBasis.once,
      },
      {
        name: "Research and locate appropriate shelter",
        description: "Appropriate shelters depend on my needs, my location, and the organization's availability.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=24#First_Sub_Point_2", name: "Examples of Emergency Shelters" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Join Facebook housing groups",
        description: "Facebook housing groups can help me find a new home within my budget and needs.",
        type: goalBasis.once,
      },
      {
        name: "Call my local help hotline",
        description: "The ability to know when and where to seek for help is crucial. A help hotline may provide the support that family and friends cannot.",
        type: goalBasis.once,
      },

      {
        name: "Tell friends and family where I am",
        description: "It is important to let my friends and family know of my location and safety.",
        type: goalBasis.daily,
      },
      {
        name: "Make a daily account of all my belongings",
        description: "Making a daily account of all belongings can reduce stress, save time, and improve productivity. It will also help keep track of these when in the shelter.",
        type: goalBasis.daily,
      },

      {
        name: "Visit my local food bank",
        description: "Food banks provide me with food that my family and I need.",
        type: goalBasis.weekly,
      },
      {
        name: "Call friends and family",
        description: "Calling friends and family is a means of self-care to help me and my loved ones feel less isolated.",
        type: goalBasis.daily,
        frequency: 3,
      },
    ],
  },

  {
    id: "traditional shelter",
    category: categories.housing,
    subcategory: housingSubcategories.emergency,
    name: "Move to traditional shelter",
    sortOrder: 3,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=24", name: "Emergency Shelter-Transitional Housing" },
    ],
    measures: {
      type: measureData.dropdown,
      startLabel: "What is your living situation now?",
      endLabel: "What living situation are you aiming for?",
      startOptions: optionLists.shelterOptions,
      // endOptions can be omitted because start and end options are the same
      defaultStart: "Living on street",
      defaultEnd: "Traditional shelter",
    },
    goals: [
      {
        name: "Gather my belongings to take to the shelter",
        description: "It is important to have and keep track of my necessary belongings when changing locations.",
        type: goalBasis.once,
      },
      {
        name: "Calculate housing budget",
        description: "Calculating my housing budget will help me decide where I can live that fits my needs.",
        type: goalBasis.once,
      },
      {
        name: "Research and locate appropriate shelter",
        description: "Appropriate shelters depend on my needs, my location, and the organization's availability.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=24#First_Sub_Point_2", name: "Examples of Emergency Shelters" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Join Facebook housing groups",
        description: "Facebook housing groups can help me find a new home within my budget and needs.",
        type: goalBasis.once,
      },
      {
        name: "Visit traditional shelter",
        description: "A traditional shelter can provide emergency shelter, along with services such as rehab and soup kitchens.",
        type: goalBasis.once,
      },
      {
        name: "Call my local help hotline",
        description: "The ability to know when and where to seek for help is crucial. A help hotline may provide the support that family and friends cannot.",
        type: goalBasis.once,
      },

      {
        name: "Make a daily account of all my belongings",
        description: "Making a daily account of all belongings can reduce stress, save time, and improve productivity. It will also help keep track of these when in the shelter.",
        type: goalBasis.daily,
      },

      {
        name: "Visit my local food bank",
        description: "Food banks provide me with food that my family and I need.",
        type: goalBasis.weekly,
      },
      {
        name: "Call friends and family",
        description: "Calling friends and family is a means of self-care to help me and my loved ones feel less isolated.",
        type: goalBasis.daily,
        frequency: 3,
      },
    ],
  },

  {
    id: "rapid rehousing",
    category: categories.housing,
    subcategory: housingSubcategories.emergency,
    name: "Move to home through 'rapid rehousing' program",
    sortOrder: 4,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=24", name: "Emergency Shelter-Transitional Housing" },
    ],
    measures: {
      type: measureData.dropdown,
      startLabel: "What is your living situation now?",
      endLabel: "What living situation are you aiming for?",
      startOptions: optionLists.rapidRehousingOptions,
      // endOptions can be omitted because start and end options are the same
      defaultStart: "Living on street",
      defaultEnd: "Rapid Rehousing program",
    },
    goals: [
      {
        name: "Research local 'Rapid Rehousing' programs",
        description: "'Rapid rehousing' programs are transitional housing programs that can provide up to 24 months rental assistance.",
        type: goalBasis.once,
      },
      {
        name: "Calculate housing budget",
        description: "Calculating my housing budget will help me decide where I can live that fits my needs.",
        type: goalBasis.once,
      },
      {
        name: "Visit a 'Rapid Rehousing' program office",
        description: "Visiting a 'rapid rehousing' program office can help me receive rental help and support from a 'rapid rehousing' program.",
        type: goalBasis.once,
      },
      {
        name: "Determine fees/costs of different programs",
        description: "It is important to determine fees/costs of different programs to select a program within my budget and future plans.",
        type: goalBasis.once,
      },
      {
        name: "Ask 'Rapid Rehousing' program staff for support and guidance",
        description: "'Rapid rehousing' program staff can give guidance and support services for families.",
        type: goalBasis.once,
      },
      {
        name: "Apply for 'Rapid Rehousing'",
        description: "'Rapid rehousing' programs are transitional housing programs that can provide up to 24 months rental assistance.",
        type: goalBasis.once,
      },
    ],
  },

  {
    id: "transitional housing",
    category: categories.housing,
    subcategory: housingSubcategories.transitional,
    name: "Move to transitional housing",
    sortOrder: 1,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=24", name: "Emergency Shelter-Transitional Housing" },
    ],
    measures: {
      type: measureData.dropdown,
      startLabel: "What is your living situation now?",
      endLabel: "What living situation are you aiming for?",
      startOptions: optionLists.transitionalHousingOptions,
      // endOptions can be omitted because start and end options are the same
      defaultStart: "Living on street",
      defaultEnd: "Transitional housing",
    },
    goals: [
      {
        name: "Research local 'Transitional housing' programs",
        description: "'Transitional Housing' programs can help provide housing for those transitioning out of homelessness.",
        type: goalBasis.once,
      },
      {
        name: "Calculate housing budget",
        description: "Calculating my housing budget will help me decide where I can live that fits my needs.",
        type: goalBasis.once,
      },
      {
        name: "Visit a 'transitional housing' program office",
        description: "'Transitional Housing' programs can help provide housing for those transitioning out of homelessness.",
        type: goalBasis.once,
      },
      {
        name: "Determine fees/costs of different programs",
        description: "It is important to determine fees/costs of different programs to select a program within my budget and future plans.",
        type: goalBasis.once,
      },
      {
        name: "Ask 'transitional housing' program staff for support and guidance",
        description: "'Transitional housing' program staff can give guidance and support services for families.",
        type: goalBasis.once,
      },
      {
        name: "Apply for 'Transitional housing'",
        description: "'Transitional Housing' programs can help provide housing for those transitioning out of homelessness.",
        type: goalBasis.once,
      },
    ],
  },

  {
    id: "rental assistance",
    category: categories.housing,
    subcategory: housingSubcategories.current,
    name: "Recieve rental assistance",
    sortOrder: 1,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=26", name: "Rental Assistance/Mediation" },
    ],
    measures: {
      type: measureData.freeform,
      startLabel: "How much rental assistance do you currently recieve?",
      endLabel: "How much rental assistance do you need?",
      unit: "$",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Calculate housing budget",
        description: "Calculating my housing budget will help me decide where I can live that fits my needs.",
        type: goalBasis.once,
      },
      {
        name: "Look up local, state, and federal resources",
        description: "Local, state, and federal resources can help with rental assistance.",
        type: goalBasis.once,
      },
      {
        name: "Apply for voucher programs",
        description: "A voucher program is a federal program assisting those in need of rental assistance.",
        type: goalBasis.once,
      },
      {
        name: "Contact public housing agency",
        description: "The public housing agency can provide low rent or free and safe rental housing.",
        type: goalBasis.once,
      },
      {
        name: "Contact a housing counseling center",
        description: "A housing counselor can help me determine the best rental assistance program for me.",
        type: goalBasis.once,
      },
      {
        name: "Get income verification",
        description: "Income verification can include pay stubs or other pay verification, such as last year's tax returns, a letter from employer, invoices, etc.",
        type: goalBasis.once,
      },
      {
        name: "Get proof of hardship",
        description: "Some rental assistance programs require showing proof of hardship, like copies of medical bills.",
        type: goalBasis.once,
      },
      {
        name: "Gather materials needed to apply for rental assistance",
        description: "When applying for rental assistance it is important to review my budget and check my eligibility for different programs.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=26", name: "Applying for Rental Assistance" },
        ],
        type: goalBasis.weekly,
      },
      {
        name: "Research local congregations and other organizations",
        description: "Local congregations and other organizations may offer help with rental assistance for those in need.",
        type: goalBasis.once,
      },
      {
        name: "Attend community meeting on housing issues",
        description: "Community meetings can give me advice and resources when dealing with housing issues.",
        type: goalBasis.once,
      },
    ],
  },

  {
    id: "mediate rent",
    category: categories.housing,
    subcategory: housingSubcategories.current,
    name: "Mediate rent with landlord",
    sortOrder: 2,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=26", name: "Rental Assistance/Mediation" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "$",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Calculate housing budget",
        description: "Calculating my housing budget will help me decide where I can live that fits my needs.",
        type: goalBasis.once,
      },
      {
        name: "Contact a tenant's rights group",
        description: "A tenant's right group can help me work through a dispute with my landlord regarding rent, payments, or other housing concerns.",
        type: goalBasis.once,
      },
      {
        name: "Arrange for lead paint test",
        description: "Lead paint can be dangerous. A lead paint test may be important to share with tenant's rights group when working through a dispute with my landlord.",
        type: goalBasis.once,
      },
      {
        name: "Find a local mediation service",
        description: "A local mediation service can help me reach a resolution when having trouble with a landlord and avoid a court battle.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=26#Fourth_Point_Header", name: "Landlord Mediation Service Steps" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Get income verification",
        description: "Income verification can include pay stubs or other pay verification, such as last year's tax returns, a letter from employer, invoices, etc.",
        type: goalBasis.once,
      },
      {
        name: "Get proof of hardship",
        description: "When mediating with my landlord, I may need to show proof of hardship, like copies of medical bills.",
        type: goalBasis.once,
      },
      {
        name: "Attend community meeting on housing issues",
        description: "Community meetings can give me advice and resources when dealing with housing issues.",
        type: goalBasis.once,
      },
      {
        name: "Gather materials needed to engage in landlord mediation",
        description: "When engaging in landlord mediation it is important to make sure I have all materials and supporting documents.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=26", name: "Landlord Mediation Steps" },
        ],
        type: goalBasis.monthly,
      },
    ],
  },

  {
    id: "mortgage assistance",
    category: categories.housing,
    subcategory: housingSubcategories.current,
    name: "Recieve mortgage assistance",
    sortOrder: 3,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=32#First_Point_Header", name: "Mortgage Assistance/Restructuring" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "$",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Make appointment with bank",
        description: "Making an appointment with the bank will help me review my savings, my financial history, and potential for a mortgage loan.",
        type: goalBasis.once,
      },
      {
        name: "Contact a housing counselor approved by the US Department of Housing",
        description: "A housing counselor can help me determine the best mortgage assistance program or loan for me.",
        type: goalBasis.once,
      },
      {
        name: "Contact lender to discuss difficulty making payments",
        description: "Talking with my lender about my current financial situation could lead to the lender giving suggestions.",
        type: goalBasis.once,
      },
      {
        name: "Review budget",
        description: "Reviewing my budget can help me determine which programs to apply for and the kind of assistance that would be most helpful.",
        type: goalBasis.once,
      },
      {
        name: "Apply for federal mortgage assistance programs",
        description: "Federal mortgage assistance programs can help me financially with my mortgage in times of need; some have certain requirements.",
        type: goalBasis.once,
      },
      {
        name: "Apply for foreclosure mediation programs",
        description: "Foreclosure mediation programs can allow me when facing a foreclosure to receive help from housing counselors to resolve a loan delinquency.",
        type: goalBasis.once,
      },
      {
        name: "Research local congregations and other organizations",
        description: "Local congregations and other organizations may offer help with mortgage assistance for those in need.",
        type: goalBasis.once,
      },
      {
        name: "Get income verification",
        description: "Income verification can include pay stubs or other pay verification, such as last year's tax returns, a letter from employer, invoices, etc.",
        type: goalBasis.once,
      },
      {
        name: "Get proof of hardship",
        description: "When searching for mortgage assistance, I may need to show proof of hardship, like copies of medical bills.",
        type: goalBasis.once,
      },
      {
        name: "Attend community meeting on housing issues",
        description: "Community meetings can give me advice and resources when dealing with housing issues.",
        type: goalBasis.once,
      },
      {
        name: "Study mortgage rights",
        description: "It is important to know mortgage rights to determine if there are any violations of the Fair Housing Act  based on sex, religion, race, etc.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=42", name: "Fair Housing Laws" },
        ],
        type: goalBasis.weekly,
      },
      {
        name: "Open and regularly respond to mail from lender",
        description: "Responding in timely way to a lender indicates the importance of communication and how it is to do business with me. Also, this will help me not to miss deadlines.",
        type: goalBasis.weekly,
      },
    ],
  },

  {
    id: "restructure mortgage",
    category: categories.housing,
    subcategory: housingSubcategories.current,
    name: "Restructure mortgage",
    sortOrder: 4,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=32#First_Point_Header", name: "Mortgage Assistance/Restructuring" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "$",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Review qualifications for mortgage resctructuring programs",
        description: "Some federally-run mortgage restructuring programs have certain requirements I should know.",
        type: goalBasis.once,
      },
      {
        name: "Apply for federal restructuring programs",
        description: "Federal restructuring programs assist me with my mortgage by making the monthly payments more affordable.",
        type: goalBasis.once,
      },
      {
        name: "Contact lender to discuss options",
        description: "Lenders can help me make a well-informed decision when searching for mortgage restructuring programs.",
        type: goalBasis.once,
      },
      {
        name: "Get income verification",
        description: "Income verification can include pay stubs or other pay verification, such as last year's tax returns, a letter from employer, invoices, etc.",
        type: goalBasis.once,
      },
      {
        name: "Get proof of hardship",
        description: "When searching for mortgage restructuring, I may need to show proof of hardship, like copies of medical bills.",
        type: goalBasis.once,
      },
      {
        name: "Attend community meeting on housing issues",
        description: "Community meetings can give me advice and resources when dealing with housing issues.",
        type: goalBasis.once,
      },
      {
        name: "Study mortgage rights",
        description: "It is important to know mortgage rights to determine if there are any violations of the Fair Housing Act  based on sex, religion, race, etc.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=42", name: "Fair Housing Laws" },
        ],
        type: goalBasis.weekly,
      },
      {
        name: "Open and regularly respond to mail from lender",
        description: "Responding in timely way to a lender indicates the importance of communication and how it is to do business with me. Also, this will help me not to miss deadlines.",
        type: goalBasis.weekly,
      },
    ],
  },

  {
    id: "rent home",
    category: categories.housing,
    subcategory: housingSubcategories.permanent,
    name: "Rent a home",
    sortOrder: 1,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=28", name: "Renting a Home" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Calculate my housing budget",
        description: "Calculating my housing budget will help me decide where I can live that fits my needs.",
        type: goalBasis.once,
      },
      {
        name: "Join Facebook housing groups",
        description: "Facebook housing groups can help me find a new home within my budget and needs.",
        type: goalBasis.once,
      },
      {
        name: "Ask landlord about reduced rent",
        description: "Asking my landlord about reduced rent can be a solution without any outside mediation.",
        type: goalBasis.once,
      },
      {
        name: "Make appointment with rental affordable housing program",
        description: "Rental affordable housing programs offer me lower rental payments.",
        type: goalBasis.once,
      },
      {
        name: "Visit an Open House",
        description: "An Open House can give me an idea if a house meets my needs and fits within my budget.",
        type: goalBasis.once,
      },
      {
        name: "Visit rental apts/houses",
        description: "Visiting rental apartments and houses can give me an idea if a house meets my needs and fits within my budget.",
        type: goalBasis.once,
      },
      {
        name: "Check how far rental is from work, school, childcare, stores, and family",
        description: "It is important to know the distance my rental is from necessary places like work, school, child care, stores, and family.",
        type: goalBasis.once,
      },
      {
        name: "Make appointment with bank",
        description: "It can be helpful to discuss my financial situation and savings with the bank when looking to rent a home.",
        type: goalBasis.once,
      },

      {
        name: "Apply to a different housing development",
        description: "A different housing development can improve my life and fulfill more needs for my family.",
        type: goalBasis.daily,
      },

      {
        name: "Save for down payment",
        description: "A down payment is a set price needed to be paid up front when renting a home.",
        type: goalBasis.weekly,
      },
      {
        name: "Search for rental apts/houses online",
        description: "Searching for rentals online can help me discover future homes.",
        type: goalBasis.daily,
        frequency: 2,
      },
      {
        name: "Search for rental apts/houses in the newspapers",
        description: "Searching for rentals in newspapers can help me discover future homes.",
        type: goalBasis.daily,
        frequency: 2,
      },
      {
        name: "Apply for an apartment",
        description: "Applying for an apartment is an opportunity to find a home within my budget and needs.",
        type: goalBasis.daily,
        frequency: 2,
      },
      {
        name: "Respond to rental listings",
        description: "Responding to rental listing is an opportunity to find a home within my budgets and needs as they come out.",
        type: goalBasis.daily,
        frequency: 2,
      },
      {
        name: "Compare rental apts/houses on real-estate app ",
        description: "Comparing rentals on real-estate apps such as Zillow to find the best apt/house for my budget and needs.",
        ttype: goalBasis.daily,
        frequency: 2,
      },
      {
        name: "Search for rental apts/houses on Facebook Marketplace and Craigslist",
        description: "Searching for rentals on Facebook Marketplace and Craigslist can help me discover future homes.",
        type: goalBasis.daily,
        frequency: 2,
      },
      {
        name: "Ask friends about rental apartment/house prices",
        description: "Friends can give insights on prices of rental apt/houses that they know of.",
        type: goalBasis.daily,
        frequency: 2,
      },
    ],
  },

  {
    id: "buy home",
    category: categories.housing,
    subcategory: housingSubcategories.permanent,
    name: "Buy a home",
    sortOrder: 2,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=36", name: "Buying a Home" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Calculate my housing budget",
        description: "Calculating my housing budget will help me decide where I can live that fits my needs.",
        type: goalBasis.once,
      },
      {
        name: "Join Facebook housing groups",
        description: "Facebook housing groups can help me find a new home within my budget and needs.",
        type: goalBasis.once,
      },
      {
        name: "Visit an Open House",
        description: "An Open House can give me an idea if a house meets my needs and fits within my budget.",
        type: goalBasis.once,
      },
      {
        name: "Check my credit score",
        description: "Higher credit scores can make it easier for me to buy a home.",
        type: goalBasis.once,
      },
      {
        name: "Make appointment with affordable housing purchase program",
        description: "Affordable housing purchase programs are homes that I can afford through having support from federal, state, or local government.",
        type: goalBasis.once,
      },
      {
        name: "Find a real estate agent",
        description: "A real estate agent is a person who represents sellers or buyers in real estate transactions.",
        type: goalBasis.once,
      },
      {
        name: "Make appointment with bank",
        description: "It is important to discuss my financial situation and savings with the bank when looking to buy a home.",
        type: goalBasis.once,
      },
      {
        name: "Check how far house is from work, school, childcare, stores, and family",
        description: "It is important to know the distance my desired house is from necessary places like work, school, child care, stores, and family.",
        type: goalBasis.once,
      },
      {
        name: "Check for household safety hazards in desired apt/house",
        description: "It is important to consider household safety hazards when deciding to rent an apt/house.",
        type: goalBasis.once,
      },
      {
        name: "Arrange for lead paint test in desired home",
        description: "Arranging a lead paint test in desired home will avoid potential for lead dust that could poison my family.",
        type: goalBasis.once,
      },
      {
        name: "Arrange for house inspection",
        description: "A housing inspection allows me to learn about major or minor issues that comes with my desired home.",
        type: goalBasis.once,
      },
      {
        name: "Attend community meeting on housing issues",
        description: "Community meetings can give me advice and resources when dealing with housing issues.",
        type: goalBasis.once,
      },

      {
        name: "Search online for apts/houses for sale",
        description: "Searching for apartments/houses for sale online can help me discover future homes.",
        type: goalBasis.weekly,
      },
      {
        name: "Search in newspapers for appartments/houses for sale",
        description: "Searching for apartments/houses for sale in newspapers can help me discover future homes.",
        type: goalBasis.weekly,
      },
      {
        name: "Respond to housing listings",
        description: "Responding to a housing listing is an opportunity to find a home within my budgets and needs as they come out.",
        type: goalBasis.weekly,
      },
      {
        name: "Ask friends about apt/house prices",
        description: "Friends can give insights on prices of apts/houses for sale that they know of.",
        type: goalBasis.weekly,
      },
      {
        name: "Compare appartments/houses on real-estate app",
        description: "Comparing apts/houses on real-estate apps such as Zillow will help me find the best apt/house for my budget and needs.",
        type: goalBasis.weekly,
      },
    ],
  },

  {
    id: "supportive hosuing",
    category: categories.housing,
    subcategory: housingSubcategories.permanent,
    name: "Find permanent supportive housing",
    sortOrder: 3,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=132", name: "Creating a Happy Home" },
      { url: "ourreach/index.php?module=ext/ipages/view&id=36", name: "Buying a Home" },
      { url: "ourreach/index.php?module=ext/ipages/view&id=28", name: "Renting a Home" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Research local 'supportive housing' programs",
        description: "'Supportive housing' programs combine affordable housing with mental health services and involvement in community life.",
        type: goalBasis.once,
      },
      {
        name: "Calculate my housing budget",
        description: "Calculating my housing budget will help me decide where me can live that fits my needs.",
        type: goalBasis.once,
      },
      {
        name: "Visit a 'supportive hosuing' program office",
        description: "'Supportive housing' programs combine affordable housing with mental health services and involvement in community life.",
        type: goalBasis.once,
      },
      {
        name: "Determine fees/costs of different programs",
        description: "It is important to determine fees/costs of different programs to select a program within my budget and future plans.",
        type: goalBasis.once,
      },
      {
        name: "Ask 'supportive housing' program staff for support and guidance",
        description: "'Supportive housing' programs can provide mental health services, support, and guidance.",
        type: goalBasis.once,
      },
      {
        name: "Apply for 'supportive housing'",
        description: "'Supportive housing' programs combine affordable housing with mental health services and involvement in community life.",
        type: goalBasis.once,
      },
      {
        name: "Attend community meeting on 'supportive housing'",
        description: "A community meeting on 'supportive housing' can give me insight on the details of living in supportive housing.",
        type: goalBasis.once,
      },
    ],
  },

  /* Start of Children Milestones*/

  {
    id: "deliver baby",
    category: categories.children,
    subcategory: childrenSubcategories.prenatal,
    name: "Deliver a healthy baby",
    sortOrder: 1,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=151", name: "Expecting a Baby" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Talk with care provider about healthy foods",
        description: "Healthy foods are essential for good health and nutrition.",
        type: goalBasis.once,
      },
      {
        name: "Ask family or friend to support healthy food choices",
        description: "Adapting to a healthier lifestyle is easier with supportive friends and family. ",
        type: goalBasis.once,
      },
      {
        name: "Enroll in a 'stop smoking' plan for pregnancy",
        description: "Smoking during pregnancy highly increases risk of health problems for developing babies.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-37&redirect_to=subentity&gotopage[1081]=1", name: "Maternal Child Health and Support Services" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Make sure I am up to date on immunizations",
        description: "Immunizations not only protect me, but also my baby from diseases.",
        type: goalBasis.once,
      },
      {
        name: "Ask doctor about how current prescription medications may affect the baby",
        description: "It is important to know current prescription medications are safe and won't harm my baby.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-39&redirect_to=subentity&gotopage[1137]=1", name: "Head Start Services" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Tour the hospital and delivery ward",
        description: "It is important to tour the hospital and delivery ward to become more familiar and reduce stress.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-37&redirect_to=subentity&gotopage[1081]=1", name: "Maternal Child Health and Support Services" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Complete prenantal genetic testing",
        description: "Parental genetic testing refers to test done during pregnancy to screen or diagnose a birth defect.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-37&redirect_to=subentity&gotopage[1081]=1", name: "Maternal Child Health and Support Services" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Learn about family health history with partner",
        description: "Learning about family health history with partner can help me identify any potential common disorders with my baby.",
        type: goalBasis.once,
      },
      {
        name: "Schedule self-care",
        description: "Scheduling self-care allows time to make sure that I am healthy and happy.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-37&redirect_to=subentity&gotopage[1081]=1", name: "Maternal Child Health and Support Services" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Research signs of labor",
        description: "Research signs of labor will inform me to when to call OB / go to hospital.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-37&redirect_to=subentity&gotopage[1081]=1", name: "Maternal Child Health and Support Services" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Register for childbirth class",
        description: "Childbirth classes offer my partner or labor coach an opportunity to understand childbirth and support me during labor.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-37&redirect_to=subentity&gotopage[1081]=1", name: "Maternal Child Health and Support Services" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Register for breastfeeding class",
        description: "A breastfeeding class will provide a comprehensive foundation of knowledge regarding breastfeeding.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-37&redirect_to=subentity&gotopage[1081]=1", name: "Maternal Child Health and Support Services" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Register for prenatal exercise class (such as yoga)",
        description: "A prenatal exercise class can reduce stress, give me energy, and increase mood.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-37&redirect_to=subentity&gotopage[1081]=1", name: "Maternal Child Health and Support Services" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Write up my birth plan",
        description: "A birth plan communicate my wishes during my labor and after the birth of my baby.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-37&redirect_to=subentity&gotopage[1081]=1", name: "Maternal Child Health and Support Services" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Choose pediatrician to visit baby in hospital",
        description: "A pediatrician when visitng my baby can diagnose and treat my baby with any disorder or infection. ",
        type: goalBasis.once,
      },

      {
        name: "Eliminate alcohol & other unprescribed drugs",
        description: "Alcohol and other unprescribed drugs can result in chronic diseases and serious problems.",
        type: goalBasis.daily,
      },
      {
        name: "Practice deep breathing",
        description: "Deep breathing decreases stress, lowers blood pressure, and relieves pain.",
        type: goalBasis.daily,
      },
      {
        name: "Read at least 15 minutes of pregnancy book",
        description: "Understanding pregnancy will explain changes and keep me more informed.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-39&redirect_to=subentity&gotopage[1137]=1", name: "Head Start Services" },
        ],
        type: goalBasis.daily,
        frequency: 2,
      },
      {
        name: "How am I feeling today? Call the doctor if I think what I am feeling isn't normal",
        description: "It is important to check up on how I am feeling and respond accordingly.",
        type: goalBasis.daily,
      },
      {
        name: "Follow 'stop smoking' plan",
        description: "Smoking during pregnancy highly increases risk of health problems for developing babies.",
        type: goalBasis.daily,
      },
      {
        name: "Sing to unborn baby",
        description: "Singing to my unborn baby develops my awareness of the baby and also helps her recognize patterns and my voices later.",
        type: goalBasis.daily,
      },
      {
        name: "Talk to unborn baby",
        description: "Talking to unborn baby can help baby develop familiarity and increases our bond.",
        type: goalBasis.daily,
      },

      {
        name: "Make time for healthy friendships",
        description: "It is important to maintain and grow friendships.",
        type: goalBasis.weekly,
      },
      {
        name: "Go to prenatal medical appointments",
        description: "Prenatal medical appointments can allow me to receive general guidance, ask questions, and communicate about the pregnancy.",
        type: goalBasis.weekly,
      },
      {
        name: "Go to prenatal exercise classes (such as yoga)",
        description: "A prenatal exercise class can reduce stress, give me energy, and increase mood.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Go to breastfeeding classes",
        description: "A breastfeeding class will provide a comprehensive foundation of knowledge regarding breastfeeding.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-37&redirect_to=subentity&gotopage[1081]=1", name: "Maternal Child Health and Support Services" },
        ],
        type: goalBasis.weekly,
      },
    ],
  },

  {
    id: "prepare home",
    category: categories.children,
    subcategory: childrenSubcategories.prenatal,
    name: "Prepare for baby coming home",
    sortOrder: 2,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=169", name: "Preparing Home for Safe Sleep" },
      { url: "ourreach/index.php?module=ext/ipages/view&id=170", name: "Preparing Home for Other Safety" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Baby-proof house/apartment",
        description: "Baby-proofing house/apartment will keep baby safe and prevent injuries.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-39&redirect_to=subentity&gotopage[1137]=1", name: "Head Start Services" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Arrange for lead paint test",
        description: "Arranging a lead paint test in desired home will avoid potential for lead dust that could poison my family.",
        type: goalBasis.once,
      },
      {
        name: "Prepare a safe sleep area for baby",
        description: "Preparing a safe sleeping area for baby will reduce chance of injury or death.",
        links: [
          { url: "https://demo.ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=169", name: "Safe Sleeping Environment Information" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Set up changing supplies",
        description: "Setting up changing supplies will keep them organized and reduce stress.",
        type: goalBasis.once,
      },
      {
        name: "Wash, fold, and hang baby supplies",
        description: "It is important to keep my baby's supplies clean and organized.",
        type: goalBasis.once,
      },
      {
        name: "Set up area for baby's items",
        description: "Setting up area for my baby's items will keep them organized and reduce stress.",
        type: goalBasis.once,
      },
      {
        name: "Prepare meals and put them in a freezer",
        description: "Preparing meals and putting them in a freezer will keep them prepared when I need to feed the baby and reduce stress.",
        type: goalBasis.once,
      },
      {
        name: "Research resources for safe baby items that are free/discounted",
        description: "Resources for safe baby items that are free/discounted will allow me to provide items my baby needs in an affordable way.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-37&redirect_to=subentity&gotopage[1081]=1", name: "Maternal Child Health and Support Services" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Register all new baby items for recalls",
        description: "Registering my new baby's items for recalls will allow manufactureres to contract me directly if an item has been recalled.",
        type: goalBasis.once,
      },
      {
        name: "Research breast pumps covered by insurance",
        description: "A breast pump is a device for drawing milk from your breast's by suction.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-37&redirect_to=subentity&gotopage[1081]=1", name: "Maternal Child Health and Support Services" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Plan how to travel to pediatrician for baby's first visit 2 days after discharge from hospital",
        description: "It is important to know how to travel for pediatrician for baby's 1st visit 2 days after discharge from hospital so the pediatrican can check the health of my baby and reduce stress.",
        type: goalBasis.once,
      },
      {
        name: "Get car seat if baby will be travelling in a car from hospital (even taxi)",
        description: "A car seats protects my baby from any crashes or car accident.",
        type: goalBasis.once,
      },
      {
        name: "Install car seat in car in which baby will be travelling from hospital",
        description: "A car seat protects my baby from any crashes or car accident.",
        type: goalBasis.once,
      },

      {
        name: "Read at least 15 minutes about child development",
        description: "It is important to learn and be prepared for my child's development.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-39&redirect_to=subentity&gotopage[1137]=1", name: "Head Start Services" },
        ],
        type: goalBasis.daily,
      },
    ],
  },

  {
    id: "raise child",
    category: categories.children,
    subcategory: childrenSubcategories.birth,
    name: "Raise a happy & healthy child",
    sortOrder: 1,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=150", name: "After Baby's Born" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Research support meetings for parents",
        description: "Parent support meetings can help me develop positive parenting solutions.",
        type: goalBasis.once,
      },
      {
        name: "Talk about family rules with my kids",
        description: "Talking family rules with my kids helps them understand what behaviors are okay.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-39&redirect_to=subentity&gotopage[1137]=1", name: "Head Start Services" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Attend parent/guardian group meeting at school",
        description: "Parent/guardian group meetings at school can give me advise and ",
        type: goalBasis.once,
      },
      {
        name: "Check library programs for ages of my kids",
        description: "Library programs for ages of my kids can help my kids' literacy skills and promote lifelong learning.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-39&redirect_to=subentity&gotopage[1137]=1", name: "Head Start Services" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Check online resources for at-home learning",
        description: "Online resources for at-home-learning can help my child develop new skills and learn new information from home.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-39&redirect_to=subentity&gotopage[1137]=1", name: "Head Start Services" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Have a family game/movie night",
        description: "Family game/movie night can allow my kids to develop social skills and an opportunity to bond with their family.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-52&redirect_to=subentity&gotopage[1137]=1", name: "Parenting Tips" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Establish a bedtime routine",
        description: "A bedtime routine (e.g., skin care, song, book, then bed) gives my child a sense of security and helps him or her fall asleep on time.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-39&redirect_to=subentity&gotopage[1137]=1", name: "Head Start Services" },
        ],
        type: goalBasis.daily,
      },

      {
        name: "Read for 20 minutes with children",
        description: "Reading with my child helps her or him develop language and listening skills.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-39&redirect_to=subentity&gotopage[1137]=1", name: "Head Start Services" },
        ],
        type: goalBasis.daily,
      },
      {
        name: "Play one-on-one for 30 minutes",
        description: "Playing one-on-one with my child has physical benefits and strengthens relationships.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-52&redirect_to=subentity&gotopage[1137]=1", name: "Parenting Tips" },
        ],
        type: goalBasis.daily,
      },
      {
        name: "Exercise together for 20 minutes",
        description: "Exercising with my child has physical benefits and strengthens relationships.",
        type: goalBasis.daily,
      },
      {
        name: "Have dinner as a family",
        description: "Having dinner as a family leads to better academic performance and higher self-esteem.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-52&redirect_to=subentity&gotopage[1137]=1", name: "Parenting Tips" },
        ],
        type: goalBasis.daily,
      },
      {
        name: "Pray as a family",
        description: "Praying as a family enables family members to address stress and bond with one another in faith.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-52&redirect_to=subentity&gotopage[1137]=1", name: "Parenting Tips" },
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-58&redirect_to=subentity&gotopage[1137]=1", name: "Virtual Camp Leader Devotionals: Day 1" },
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-59&redirect_to=subentity&gotopage[1137]=1", name: "Virtual Camp Leader Devotionals: Day 2" },
        ],
        type: goalBasis.daily,
      },
      {
        name: "Help my child/ren with homework",
        description: "Helping child/ren with homework can improve their understanding of the material and learn better.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-39&redirect_to=subentity&gotopage[1137]=1", name: "Head Start Services" },
        ],
        type: goalBasis.daily,
      },
      {
        name: "Talk to my child about all that's going on",
        description: "Talking with my child helps him or her build language and learn more about the world.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-39&redirect_to=subentity&gotopage[1137]=1", name: "Head Start Services" },
        ],
        type: goalBasis.daily,
      },
      {
        name: "Keep the TV turned off while my baby is around",
        description: "Interacting and playing with others helps babies learn about the world.",
        type: goalBasis.daily,
      },
      {
        name: "Limit screen time",
        description: "Less screen time (less than 1 hour for children and none for babies under 2) encourages healthy physical and social development.",
        type: goalBasis.daily,
      },
      {
        name: "Tummy time for babies after each feeding",
        description: "Tummy time for my baby encourages development of the core muscles of the neck, back, and shoulder, and helps the baby's visual, sensory, and motor development.",
        type: goalBasis.daily,
      },

      {
        name: "Play stacking/building games",
        description: "Stacking/building games help my child develop hand eye coordination and blance.",
        type: goalBasis.weekly,
      },
      {
        name: "Play singing/clapping games",
        description: "Singing/clapping games help my child develop motor and cognitive skills.",
        type: goalBasis.weekly,
      },
      {
        name: "Have my child/ren help in household tasks",
        description: "Child/ren helping in household tasks promotes work ethic and reduce stress from me.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-52&redirect_to=subentity&gotopage[1137]=1", name: "Parenting Tips" },
        ],
        type: goalBasis.daily,
      },
      {
        name: "Do arts and crafts with child/ren",
        description: "Arts and crafts give child/ren an opportunity to learn and improve their skills.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-39&redirect_to=subentity&gotopage[1137]=1", name: "Head Start Services" },
        ],
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Do storytelling with child/ren",
        description: "Storytelling with child/ren help my children get to know sounds, word, and language.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-39&redirect_to=subentity&gotopage[1137]=1", name: "Head Start Services" },
        ],
        type: goalBasis.weekly,
      },
      {
        name: "Safely visit a park",
        description: "Visiting a park encourages children to have healthy physical and social development.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Go to support meeting for parents",
        description: "Parent support meetings can help develop positive parenting solutions.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-39&redirect_to=subentity&gotopage[1137]=1", name: "Head Start Services" },
        ],
        type: goalBasis.weekly,
      },
    ],
  },

  {
    id: "raise newborn",
    category: categories.children,
    subcategory: childrenSubcategories.birth,
    name: "Raise a happy & healthy newborn (0-2 months)",
    sortOrder: 2,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=150", name: "After Baby's Born" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Discuss with care provider whether family & friends will be allowed to visit",
        description: "It is important to know if it is safe for family and friends to visit after my baby's birth. ",
        type: goalBasis.once,
      },
      {
        name: "Talk with familly & friends about whether they will be allowed to visit",
        description: "It is important to discuss if it is safe for family and friends to visit after my baby's birth. ",
        type: goalBasis.once,
      },
      {
        name: "Make an appointment with a lactation consultant",
        description: "A lactation consultant can help address any of my concerns and make any adjustments.",
        type: goalBasis.once,
      },
      {
        name: "Make sure pediatrician visits baby in hospital or birth center",
        description: "A pediatrician when visitng my baby can diagnose and treat my baby with any disorder or infection. ",
        type: goalBasis.once,
      },
      {
        name: "Go to pediatrician appointment less than 2 days after hospital/birth center discharge",
        description: "Pediatrician appointment less than 2 days after hospital will check my baby for jaundice and health conditions not detected at the hospital.",
        type: goalBasis.once,
      },
      {
        name: "Go to 1 month pediatrician appointment",
        description: "The 1 month pediatrician appointment will chech if my baby is developing and growing.",
        type: goalBasis.once,
      },
      {
        name: "Go to 2 month pediatrician appointment",
        description: "The 2 month pediatrician appointment is where my baby will receive necessary vaccines.",
        type: goalBasis.once,
      },
      {
        name: "Make sure baby's sleeping area is safe",
        description: "Preparing a safe sleeping area for baby will reduce chance of injury or death.",
        links: [
          { url: "https://demo.ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=169", name: "Safe Sleeping Environment Information" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Research breastfeeding support group",
        description: "A breastfeeding class will provide a comprehensive foundation of knowledge regarding breastfeeding.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-37&redirect_to=subentity&gotopage[1081]=1", name: "Maternal Child Health and Support Services" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Research parent support group",
        description: "Parent support meetings can help me develop positive parenting solutions.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-37&redirect_to=subentity&gotopage[1081]=1", name: "Maternal Child Health and Support Services" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Research tongue ties in babies",
        description: "Tongue ties in babies prevents my baby's tongue from moving as freely as it should.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-37&redirect_to=subentity&gotopage[1081]=1", name: "Maternal Child Health and Support Services" },
        ],
        type: goalBasis.once,
      },

      {
        name: "Track wet/dry diapers",
        description: "Tracking wet/dry diapers helps me know about how much my baby is drinking and how she or he is processing the nutrition. Changing diapers helps prevent skin irritation and promote healthiness.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-31&redirect_to=subentity&gotopage[1081]=1", name: "Central Jersey Diaper Bank" },
        ],
        type: goalBasis.daily,
      },
      {
        name: "Check if baby is jaundiced",
        description: "If a baby is jaundiced he or she may need a bilirubin test done.",
        type: goalBasis.daily,
      },
      {
        name: "Feed baby every 3 hours or more frequently if needed",
        description: "Feeding baby every 3 hours or more gives the baby practice at sucking and swallowing.",
        type: goalBasis.daily,
      },
      {
        name: "Tummy time after each feeding (including baby sleeping on awake mom's chest",
        description: "Tummy time for my baby encourages development of the core muscles of the neck, back, and shoulder, and helps the baby's visual, sensory, and motor development.",
        type: goalBasis.daily,
      },
      {
        name: "Check for safe sleeping every time baby sleeps",
        description: "Checking for safe sleeping for my baby reduces the chance of sleep-related infant injury or death.",
        type: goalBasis.daily,
      },
      {
        name: "Do proper umbillical chord care",
        description: "Umbilical cord care helps prevent infection.",
        type: goalBasis.daily,
      },
      {
        name: "Read a book with my baby",
        description: "Reading with my baby will help her or him learn social skills and language.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-39&redirect_to=subentity&gotopage[1137]=1", name: "Head Start Services" },
        ],
        type: goalBasis.daily,
      },
      {
        name: "Talk with my baby",
        description: "Talking with my baby will help her or him learn social skills and language.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-39&redirect_to=subentity&gotopage[1137]=1", name: "Head Start Services" },
        ],
        type: goalBasis.daily,
      },
      {
        name: "Read for 15 minutes about infant development",
        description: "It is important to know about my infant's needs and his or her development.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-39&redirect_to=subentity&gotopage[1137]=1", name: "Head Start Services" },
        ],
        type: goalBasis.daily,
      },

      {
        name: "Play finger games with my baby",
        description: "Babies will learn healthy social skills, language, and motor development.",
        type: goalBasis.weekly,
      },
      {
        name: "Play singing games with my baby",
        description: "Babies will learn healthy social skills, language, and motor development.",
        type: goalBasis.weekly,
      },
      {
        name: "Go to lactation consultant appointment",
        description: "A lactation consultant can help address any of my concerns and make any adjustments.",
        type: goalBasis.weekly,
      },
      {
        name: "Go to breastfeeding support group",
        description: "Breastfeeding support groups can help me breastfeed longer and with more satisfaction, to help benefit my baby and me.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-37&redirect_to=subentity&gotopage[1081]=1", name: "Maternal Child Health and Support Services" },
        ],
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Go to parent support group",
        description: "Parent support meetings can help me develop positive parenting solutions.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-39&redirect_to=subentity&gotopage[1137]=1", name: "Head Start Services" },
        ],
        type: goalBasis.daily,
        frequency: 3,
      },
    ],
  },

  {
    id: "three months",
    category: categories.children,
    subcategory: childrenSubcategories.birth,
    name: "Be healthy in the three-plus months after giving birth",
    sortOrder: 3,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=150", name: "After Baby's Born" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Research 'post-birth' warning signs of blod clots, severe headache, etc. to call OB or go to ER",
        description: "Knowing post-birth warning signs can help me decide whether I should seek help.",
        links: [
          { url: "https://www.awhonn.org/wp-content/uploads/2020/02/pbwssylhandoutenglish.pdf)", name: "Post-Birth Warning Signs" },
        ],
        type: goalBasis.daily,
      },
      {
        name: "Make appointment with a lactation consultant",
        description: "A lactation consultant can help address any of my concerns and make any adjustments.",
        type: goalBasis.once,
      },
      {
        name: "Go to six week post-partum appointment",
        description: "Postpartum depression is when I feel sadness, anxiety, and mood swings in the few weeks following the birth.",
        type: goalBasis.once,
      },
      {
        name: "Complete post-partum mental health screening",
        description: "Postpartum depression is when I feel sadness, anxiety, and mood swings in the few weeks following the birth.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-37&redirect_to=subentity&gotopage[1081]=1", name: "Maternal Child Health and Support Services" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Learn about shaken baby syndrome",
        description: "Shaken baby syndrome is a form of abuse on my baby when a parent or caregiver shakes a baby out of anger or frustration.",
        type: goalBasis.once,
      },
      {
        name: "Discuss with OB about returning to contraceptive",
        description: "Discussing with OB about returning to contraceptives is important because it is possible to get pregnant very soon after having my baby which carries risks.",
        type: goalBasis.once,
      },
      {
        name: "Research breastfeeding support group",
        description: "A breastfeeding class will provide a comprehensive foundation of knowledge regarding breastfeeding.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-37&redirect_to=subentity&gotopage[1081]=1", name: "Maternal Child Health and Support Services" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Research parent support group",
        description: "Parent support meetings can help me develop positive parenting solutions.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-37&redirect_to=subentity&gotopage[1081]=1", name: "Maternal Child Health and Support Services" },
        ],
        type: goalBasis.once,
      },

      {
        name: "Continue to take prenatal vitamin",
        description: "Prenatal vitamins provide key nutrients to help support the baby.",
        type: goalBasis.daily,
      },
      {
        name: "Monitor blood pressure",
        description: "Monitoring blood pressure gives a clearer picture of heart disease and stroke.",
        type: goalBasis.daily,
      },
      {
        name: "Take prescribed medications for blood pressure",
        description: "Blood pressure medication can help keep my blood pressure at healthy levels.",
        type: goalBasis.daily,
      },
      {
        name: "Monitor for 'post-birth' warning signs of blod clots, severe headache, etc. to call OB or go to ER",
        description: "Knowing post-birth warning signs can help me decide whether I should seek help.",
        links: [
          { url: "https://www.awhonn.org/wp-content/uploads/2020/02/pbwssylhandoutenglish.pdf)", name: "Post-Birth Warning Signs" },
        ],
        type: goalBasis.daily,
      },
      {
        name: "Drink 128 ounces of water per day",
        type: goalBasis.daily,
      },

      {
        name: "Reach out to family/friend(s) for support",
        description: "Family/friends can give needed support when caring for an infant.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-52&redirect_to=subentity&gotopage[1137]=1", name: "Parenting Tips" },
        ],
        type: goalBasis.weekly,
      },
      {
        name: "Tell a friend when/if I'm having trouble with anxiety or depression",
        description: "Sharing with a friend about my troubles will reduce stress and help find solutions.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-39&redirect_to=subentity&gotopage[1137]=1", name: "Head Start Services" },
        ],
        type: goalBasis.daily,
      },
      {
        name: "Go to lactation consultant",
        description: "A lactation consultant can help address any of my concerns and make any adjustments.",
        type: goalBasis.weekly,
      },
      {
        name: "Go to breastfeeding support group",
        description: "Breastfeeding support groups can help me breastfeed longer and with more satisfaction, to help benefit my baby and me.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-37&redirect_to=subentity&gotopage[1081]=1", name: "Maternal Child Health and Support Services" },
        ],
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Go to parent support group",
        description: "Parent support meetings can help me develop positive parenting solutions.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-39&redirect_to=subentity&gotopage[1137]=1", name: "Head Start Services" },
        ],
        type: goalBasis.daily,
        frequency: 3,
      },
    ],
  },

  {
    id: "pediatrician 0-6 months",
    category: categories.children,
    subcategory: childrenSubcategories.pediatrician,
    name: "Pediatrician well visits and vaccinations (0-6 months)",
    sortOrder: 1,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=173", name: "Vaccines Birth-6 years" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Schedule pediatrician well visits",
        description: "My baby needs regular \"well-visits\" to track health and get scheduled immunizations. I can also ask my pediatrician about nutrition and other topics.",
        type: goalBasis.once,
      },
      {
        name: "Schedule vaccination(s)",
        description: "Vaccines are very important in preventing diseases.",
        type: goalBasis.once,
      },
      {
        name: "Go to pediatrician well visit",
        description: "My baby needs regular well-visits to track health and get scheduled immunizations. I can also ask my pediatrician about nutrition and other topics.",
        type: goalBasis.yearly,
      },
      {
        name: "Have child vaccinated",
        type: goalBasis.once,
      },
    ],
  },

  {
    id: "pediatrician 7-18 months",
    category: categories.children,
    subcategory: childrenSubcategories.pediatrician,
    name: "Pediatrician well visits and vaccinations (7-18 months)",
    sortOrder: 2,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=173", name: "Vaccines Birth-6 years" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Schedule pediatrician well visits",
        type: goalBasis.once,
      },
      {
        name: "Schedule vaccination(s)",
        description: "Vaccines are very important in preventing diseases.",
        type: goalBasis.once,
      },
      {
        name: "Go to pediatrician well visit",
        type: goalBasis.once,
      },
      {
        name: "Have child vaccinated",
        type: goalBasis.once,
      },
    ],
  },

  {
    id: "pediatrician 19 months - 3 years",
    category: categories.children,
    subcategory: childrenSubcategories.pediatrician,
    name: "Pediatrician well visits and vaccinations (19 months - 3 years)",
    sortOrder: 3,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=173", name: "Vaccines Birth-6 years" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Schedule pediatrician well visits",
        type: goalBasis.once,
      },
      {
        name: "Schedule vaccination(s)",
        description: "Vaccines are very important in preventing diseases.",
        type: goalBasis.once,
      },
      {
        name: "Go to pediatrician well visit",
        type: goalBasis.once,
      },
      {
        name: "Have child vaccinated",
        type: goalBasis.once,
      },
    ],
  },

  {
    id: "pediatrician 4-6 years",
    category: categories.children,
    subcategory: childrenSubcategories.pediatrician,
    name: "Pediatrician well visits and vaccinations (4-6 years)",
    sortOrder: 4,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=173", name: "Vaccines Birth-6 years" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Schedule pediatrician well visits",
        type: goalBasis.once,
      },
      {
        name: "Schedule vaccination(s)",
        description: "Vaccines are very important in preventing diseases.",
        type: goalBasis.once,
      },
      {
        name: "Go to pediatrician well visit",
        type: goalBasis.once,
      },
      {
        name: "Have child vaccinated",
        type: goalBasis.once,
      },
    ],
  },

  {
    id: "pediatrician 7-10 years",
    category: categories.children,
    subcategory: childrenSubcategories.pediatrician,
    name: "Pediatrician well visits and vaccinations (7-10 years)",
    sortOrder: 5,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=96", name: "Vaccines" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Schedule pediatrician well visits",
        type: goalBasis.once,
      },
      {
        name: "Schedule vaccination(s)",
        description: "Vaccines are very important in preventing diseases.",
        type: goalBasis.once,
      },
      {
        name: "Go to pediatrician well visit",
        type: goalBasis.once,
      },
      {
        name: "Have child vaccinated",
        type: goalBasis.once,
      },
    ],
  },

  {
    id: "pediatrician 11-14 years",
    category: categories.children,
    subcategory: childrenSubcategories.pediatrician,
    name: "Pediatrician well visits and vaccinations (11-14 years)",
    sortOrder: 6,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=96", name: "Vaccines" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Schedule pediatrician well visits",
        type: goalBasis.once,
      },
      {
        name: "Schedule vaccination(s)",
        description: "Vaccines are very important in preventing diseases.",
        type: goalBasis.once,
      },
      {
        name: "Go to pediatrician well visit",
        type: goalBasis.once,
      },
      {
        name: "Have child vaccinated",
        type: goalBasis.once,
      },
    ],
  },

  {
    id: "pediatrician 15-18 years",
    category: categories.children,
    subcategory: childrenSubcategories.pediatrician,
    name: "Pediatrician well visits and vaccinations (15-18 years)",
    sortOrder: 7,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=96", name: "Vaccines" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Schedule pediatrician well visits",
        type: goalBasis.once,
      },
      {
        name: "Schedule vaccination(s)",
        description: "Vaccines are very important in preventing diseases.",
        type: goalBasis.once,
      },
      {
        name: "Go to pediatrician well visit",
        type: goalBasis.once,
      },
      {
        name: "Have child vaccinated",
        type: goalBasis.once,
      },
    ],
  },

  {
    id: "dentist 4-6 years",
    category: categories.children,
    subcategory: childrenSubcategories.dentist,
    name: "Dentist visits (4-6 years)",
    sortOrder: 1,
    links: [
      { url: "", name: "" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Schedule two dentist visits per year per child",
        type: goalBasis.once,
      },
      {
        name: "Go to child's first dentist visit for the year",
        type: goalBasis.once,
      },
      {
        name: "Go to child's second dentist visit for the year",
        type: goalBasis.once,
      },
    ],
  },

  {
    id: "dentist 7-10 years",
    category: categories.children,
    subcategory: childrenSubcategories.dentist,
    name: "Dentist visits (7-10 years)",
    sortOrder: 2,
    links: [
      { url: "", name: "" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Schedule two dentist visits per year per child",
        type: goalBasis.once,
      },
      {
        name: "Go to child's first dentist visit for the year",
        type: goalBasis.once,
      },
      {
        name: "Go to child's second dentist visit for the year",
        type: goalBasis.once,
      },
    ],
  },

  {
    id: "dentist 11-14 years",
    category: categories.children,
    subcategory: childrenSubcategories.dentist,
    name: "Dentist visits (11-14 years)",
    sortOrder: 3,
    links: [
      { url: "", name: "" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Schedule two dentist visits per year per child",
        type: goalBasis.once,
      },
      {
        name: "Go to child's first dentist visit for the year",
        type: goalBasis.once,
      },
      {
        name: "Go to child's second dentist visit for the year",
        type: goalBasis.once,
      },
    ],
  },

  {
    id: "dentist 15-18 years",
    category: categories.children,
    subcategory: childrenSubcategories.dentist,
    name: "Dentist visits (15-18 years)",
    sortOrder: 4,
    links: [
      { url: "", name: "" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Schedule two dentist visits per year per child",
        type: goalBasis.once,
      },
      {
        name: "Go to child's first dentist visit for the year",
        type: goalBasis.once,
      },
      {
        name: "Go to child's second dentist visit for the year",
        type: goalBasis.once,
      },
    ],
  },

  /* Start of Jobs Milestones*/

  {
    id: "close to home",
    category: categories.jobs,
    subcategory: jobsSubcategories.location,
    name: "Close to home",
    sortOrder: 1,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=135", name: "Researching Jobs" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Update resume",
        description: "Updating my resume will display my new work experience, education, and skills.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=139", name: "Formatting Resume" }
        ],
        type: goalBasis.once,
      },
      {
        name: "Update cover letter",
        description: "Updating my cover letter will display my motivation, work history, and professional skills.",
        type: goalBasis.once,
      },
      {
        name: "Prepare 5 job interview questions",
        description: "Preparing 5 job interview questions will display my interest and reduce stress when asked.",
        type: goalBasis.once,
      },
      {
        name: "Ask friend, family, or mentor to look over the resume and cover letter before sending it out",
        description: "Asking family, friends or mentor to look over my resume and cover letter will allow me to receive feedback and make revisions.",
        type: goalBasis.once,
      },
      {
        name: "Upload resume and cover letter to job-finding sites",
        description: "Uploading my resume and cover letter to job-finding sites will help recruiters learn about me and help me reach out to employers.",
        type: goalBasis.once,
      },

      {
        name: "Ask friend(s) and family about job openings",
        description: "Friends or family can give insight on potential job openings that they know of.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Search online for jobs",
        description: "Searching online can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Check the newspaper for jobs",
        description: "Searching in the newspaper can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Submit an application to 2 job listings",
        description: "Applying to a job listing allows me the chance of getting a job that meets my needs.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Reflect, talk to friend(s) and family",
        description: "Reflecting and talking to friends and family can reduce stress and help me understand situations better.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-53&redirect_to=subentity&gotopage[1137]=1", name: "Starting a Business" },
        ],
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Prepare for job interview",
        description: "Preparing for a job interview will improve my chances and confidence in the interview.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=140", name: "Steps to Prepare for Job Interview" }
        ],
        type: goalBasis.weekly,
      },
    ],
  },

  {
    id: "close to school",
    category: categories.jobs,
    subcategory: jobsSubcategories.location,
    name: "Close to child/ren's school/s",
    sortOrder: 2,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=135", name: "Researching Jobs" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Update resume",
        description: "Updating my resume will display my new work experience, education, and skills.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=139", name: "Formatting Resume" }
        ],
        type: goalBasis.once,
      },
      {
        name: "Update cover letter",
        description: "Updating my cover letter will display my motivation, work history, and professional skills.",
        type: goalBasis.once,
      },
      {
        name: "Prepare 5 job interview questions",
        description: "Preparing 5 job interview questions will display my interest and reduce stress when asked.",
        type: goalBasis.once,
      },
      {
        name: "Ask friend, family, or mentor to look over the resume and cover letter before sending it out",
        description: "Asking family, friends or mentor to look over my resume and cover letter will allow me to receive feedback and make revisions.",
        type: goalBasis.once,
      },
      {
        name: "Upload resume and cover letter to job-finding sites",
        description: "Uploading my resume and cover letter to job-finding sites will help recruiters learn about me and help me reach out to employers.",
        type: goalBasis.once,
      },

      {
        name: "Ask friend(s) and family about job openings",
        description: "Friends or family can give insight on potential job openings that they know of.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Search online for jobs",
        description: "Searching online can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Check the newspaper for jobs",
        description: "Searching in the newspaper can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Submit an application to 2 job listings",
        description: "Applying to a job listing allows me the chance of getting a job that meets my needs.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Reflect, talk to friend(s) and family",
        description: "Reflecting and talking to friends and family can reduce stress and help me understand situations better.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-53&redirect_to=subentity&gotopage[1137]=1", name: "Starting a Business" },
        ],
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Prepare for job interview",
        description: "Preparing for a job interview will improve my chances and confidence in the interview.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=140", name: "Steps to Prepare for Job Interview" }
        ],
        type: goalBasis.weekly,
      },
    ],
  },

  {
    id: "commute jobs",
    category: categories.jobs,
    subcategory: jobsSubcategories.location,
    name: "Easy commute",
    sortOrder: 3,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=135", name: "Researching Jobs" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Update resume",
        description: "Updating my resume will display my new work experience, education, and skills.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=139", name: "Formatting Resume" }
        ],
        type: goalBasis.once,
      },
      {
        name: "Update cover letter",
        description: "Updating my cover letter will display my motivation, work history, and professional skills.",
        type: goalBasis.once,
      },
      {
        name: "Get a MetroCard, buss pass, transit pass, etc",
        description: "Getting a MetroCard, bus pass, transit pass, etc will allow me to commute to work.",
        type: goalBasis.once,
      },
      {
        name: "Prepare 5 job interview questions",
        description: "Preparing 5 job interview questions will display my interest and reduce stress when asked.",
        type: goalBasis.once,
      },
      {
        name: "Ask friend, family, or mentor to look over the resume and cover letter before sending it out",
        description: "Asking family, friends or mentor to look over my resume and cover letter will allow me to receive feedback and make revisions.",
        type: goalBasis.once,
      },
      {
        name: "Upload resume and cover letter to job-finding sites",
        description: "Uploading my resume and cover letter to job-finding sites will help recruiters learn about me and help me reach out to employers.",
        type: goalBasis.once,
      },

      {
        name: "Ask friend(s) and family about job openings",
        description: "Friends or family can give insight on potential job openings that they know of.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Search online for jobs",
        description: "Searching online can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Check the newspaper for jobs",
        description: "Searching in the newspaper can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Submit an application to 2 job listings",
        description: "Applying to a job listing allows me the chance of getting a job that meets my needs.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Reflect, talk to friend(s) and family",
        description: "Reflecting and talking to friends and family can reduce stress and help me understand situations better.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-53&redirect_to=subentity&gotopage[1137]=1", name: "Starting a Business" },
        ],
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Prepare for job interview",
        description: "Preparing for a job interview will improve my chances and confidence in the interview.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=140", name: "Steps to Prepare for Job Interview" }
        ],
        type: goalBasis.weekly,
      },
    ],
  },

  {
    id: "support family",
    category: categories.jobs,
    subcategory: jobsSubcategories.income,
    name: "Income is enough to support my family",
    sortOrder: 1,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=134", name: "Job Goals" },
      { url: "ourreach/index.php?module=ext/ipages/view&id=135", name: "Researching Jobs" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Update resume",
        description: "Updating my resume will display my new work experience, education, and skills.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=139", name: "Formatting Resume" }
        ],
        type: goalBasis.once,
      },
      {
        name: "Update cover letter",
        description: "Updating my cover letter will display my motivation, work history, and professional skills.",
        type: goalBasis.once,
      },
      {
        name: "Pick appropriate attire for interview",
        description: "Picking appropriate attire for my interview shows I am serious about the job and the interviewer's time.",
        type: goalBasis.once,
      },
      {
        name: "Look up employee testimonials on online job sites",
        description: "Employee testimonials on online job sites (such as LinkedIn, Glassdoor, etc) give me more insight and information on the job.",
        type: goalBasis.once,
      },
      {
        name: "Look over budget",
        description: "Looking over my budget will show me if my income will allow me to pay all my expenses.",
        type: goalBasis.once,
      },
      {
        name: "Discuss different job opportunities with family",
        description: "My family can advise me and suggest different job opportunities based on my responsibilites and skills.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-53&redirect_to=subentity&gotopage[1137]=1", name: "Starting a Business" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Prepare 5 job interview questions",
        description: "Preparing 5 job interview questions will display my interest and reduce stress when asked.",
        type: goalBasis.once,
      },
      {
        name: "Ask friend, family, or mentor to look over the resume and cover letter before sending it out",
        description: "Asking family, friends or mentor to look over my resume and cover letter will allow me to receive feedback and make revisions.",
        type: goalBasis.once,
      },
      {
        name: "Upload resume and cover letter to job-finding sites",
        description: "Uploading my resume and cover letter to job-finding sites will help recruiters learn about me and help me reach out to employers.",
        type: goalBasis.once,
      },

      {
        name: "Ask friend(s) and family about job openings",
        description: "Friends or family can give insight on potential job openings that they know of.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Search online for jobs",
        description: "Searching online can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Check the newspaper for jobs",
        description: "Searching in the newspaper can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Spend time networking",
        description: "Networking can help me gain knowledge and advance my career.",
        type: goalBasis.daily,
      },
      {
        name: "Work on improving skills",
        description: "Improving skills can help me become more prepared and desirable in job searching.",

        type: goalBasis.daily,
      },
      {
        name: "Submit an application to 2 job listings",
        description: "Applying to a job listing allows me the chance of getting a job that meets my needs.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Prepare for job interview",
        description: "Preparing for a job interview will improve my chances and confidence in the interview.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=140", name: "Steps to Prepare for Job Interview" }
        ],
        type: goalBasis.weekly,
      },
    ],
  },

  {
    id: "live comfortably",
    category: categories.jobs,
    subcategory: jobsSubcategories.income,
    name: "Income is enough to live comfortably",
    sortOrder: 2,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=134", name: "Job Goals" },
      { url: "ourreach/index.php?module=ext/ipages/view&id=135", name: "Researching Jobs" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Update resume",
        description: "Updating my resume will display my new work experience, education, and skills.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=139", name: "Formatting Resume" }
        ],
        type: goalBasis.once,
      },
      {
        name: "Update cover letter",
        description: "Updating my cover letter will display my motivation, work history, and professional skills.",
        type: goalBasis.once,
      },
      {
        name: "Pick appropriate attire for interview",
        description: "Picking appropriate attire for my interview shows I am serious about the job and the interviewer's time.",
        type: goalBasis.once,
      },
      {
        name: "Look up employee testimonials on online job sites",
        description: "Employee testimonials on online job sites (such as LinkedIn, Glassdoor, etc) give me more insight and information on the job.",
        type: goalBasis.once,
      },
      {
        name: "Look over budget",
        description: "Looking over my budget will show me if my income will allow me to pay all my expenses.",
        type: goalBasis.once,
      },
      {
        name: "Discuss different job opportunities with family",
        description: "My family can advise me and suggest different job opportunities based on my responsibilites and skills.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-53&redirect_to=subentity&gotopage[1137]=1", name: "Starting a Business" },
        ],
        type: goalBasis.once,
      },
      {
        name: "Prepare 5 job interview questions",
        description: "Preparing 5 job interview questions will display my interest and reduce stress when asked.",
        type: goalBasis.once,
      },
      {
        name: "Ask friend, family, or mentor to look over the resume and cover letter before sending it out",
        description: "Asking family, friends or mentor to look over my resume and cover letter will allow me to receive feedback and make revisions.",
        type: goalBasis.once,
      },
      {
        name: "Upload resume and cover letter to job-finding sites",
        description: "Uploading my resume and cover letter to job-finding sites will help recruiters learn about me and help me reach out to employers.",
        type: goalBasis.once,
      },

      {
        name: "Ask friend(s) and family about job openings",
        description: "Friends or family can give insight on potential job openings that they know of.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Search online for jobs",
        description: "Searching online can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Check the newspaper for jobs",
        description: "Searching in the newspaper can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Spend time networking",
        description: "Networking can help me gain knowledge and advance my career.",
        type: goalBasis.daily,
      },
      {
        name: "Work on improving skills",
        description: "Improving skills can help me become more prepared and desirable in job searching.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-53&redirect_to=subentity&gotopage[1137]=1", name: "Starting a Business" },
        ],
        type: goalBasis.daily,
      },
      {
        name: "Submit an application to 2 job listings",
        description: "Applying to a job listing allows me the chance of getting a job that meets my needs.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Prepare for job interview",
        description: "Preparing for a job interview will improve my chances and confidence in the interview.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=140", name: "Steps to Prepare for Job Interview" }
        ],
        type: goalBasis.weekly,
      },
    ],
  },

  {
    id: "benefits i want",
    category: categories.jobs,
    subcategory: jobsSubcategories.income,
    name: "Amount and type of benefits I want",
    sortOrder: 3,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=134", name: "Job Goals" },
      { url: "ourreach/index.php?module=ext/ipages/view&id=135", name: "Researching Jobs" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Update resume",
        description: "Updating my resume will display my new work experience, education, and skills.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=139", name: "Formatting Resume" }
        ],
        type: goalBasis.once,
      },
      {
        name: "Update cover letter",
        description: "Updating my cover letter will display my motivation, work history, and professional skills.",
        type: goalBasis.once,
      },
      {
        name: "Pick appropriate attire for interview",
        description: "Picking appropriate attire for my interview shows I am serious about the job and the interviewer's time.",
        type: goalBasis.once,
      },
      {
        name: "Look up employee testimonials on online job sites",
        description: "Employee testimonials on online job sites (such as LinkedIn, Glassdoor, etc) give me more insight and information on the job.",
        type: goalBasis.once,
      },
      {
        name: "Talk to company recruiter",
        description: "A company recruiter can give me information about the application process and the job.",
        type: goalBasis.once,
      },
      {
        name: "Research more about benefits",
        description: "Many jobs offer benefits like paid time off, vacation days, health insurance, and more.",
        type: goalBasis.once,
      },
      {
        name: "Prepare 5 job interview questions",
        description: "Preparing 5 job interview questions will display my interest and reduce stress when asked.",
        type: goalBasis.once,
      },
      {
        name: "Ask potential employer about benefits after the interview",
        description: "Many jobs offer benefits like paid time off, vacation days, health insurance, and more.",
        type: goalBasis.once,
      },
      {
        name: "Ask friend, family, or mentor to look over the resume and cover letter before sending it out",
        description: "Asking family, friends or mentor to look over my resume and cover letter will allow me to receive feedback and make revisions.",
        type: goalBasis.once,
      },
      {
        name: "Upload resume and cover letter to job-finding sites",
        description: "Uploading my resume and cover letter to job-finding sites will help recruiters learn about me and help me reach out to employers.",
        type: goalBasis.once,
      },

      {
        name: "Ask friend(s) and family about job openings",
        description: "Friends or family can give insight on potential job openings that they know of.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Search online for jobs",
        description: "Searching online can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Check the newspaper for jobs",
        description: "Searching in the newspaper can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Spend time networking",
        description: "Networking can help me gain knowledge and advance my career.",
        type: goalBasis.daily,
      },
      {
        name: "Work on improving skills",
        description: "Improving skills can help me become more prepared and desirable in job searching.",
        type: goalBasis.daily,
      },
      {
        name: "Submit an application to 2 job listings",
        description: "Applying to a job listing allows me the chance of getting a job that meets my needs.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Prepare for job interview",
        description: "Preparing for a job interview will improve my chances and confidence in the interview.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=140", name: "Steps to Prepare for Job Interview" }
        ],
        type: goalBasis.weekly,
      },
    ],
  },

  {
    id: "reliable schedule",
    category: categories.jobs,
    subcategory: jobsSubcategories.schedule,
    name: "Reliable work schedule similar each week",
    sortOrder: 1,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=134", name: "Job Goals" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Update resume",
        description: "Updating my resume will display my new work experience, education, and skills.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=139", name: "Formatting Resume" }
        ],
        type: goalBasis.once,
      },
      {
        name: "Update cover letter",
        description: "Updating my cover letter will display my motivation, work history, and professional skills.",
        type: goalBasis.once,
      },
      {
        name: "Pick appropriate attire for interview",
        description: "Picking appropriate attire for my interview shows I am serious about the job and the interviewer's time.",
        type: goalBasis.once,
      },
      {
        name: "Look up employee testimonials on online job sites",
        description: "Employee testimonials on online job sites (such as LinkedIn, Glassdoor, etc) give me more insight and information on the job.",
        type: goalBasis.once,
      },
      {
        name: "Talk to company recruiter",
        description: "A company recruiter can give me information about the application process and the job.",
        type: goalBasis.once,
      },
      {
        name: "Map out schedule I would like",
        description: "Mapping out a schedule I would like would organize my work time with all my other responsibilities.",
        type: goalBasis.once,
      },
      {
        name: "Make appointment to talk with manager to ask for a new schedule",
        description: "Asking my manager for a new schedule will allow me to better organize my work time with all my other responsibilities.",
        type: goalBasis.once,
      },
      {
        name: "Prepare 5 interview questions",
        description: "Preparing 5 job interview questions will display my interest and reduce stress when asked.",
        type: goalBasis.once,
      },
      {
        name: "Plan childcare",
        description: "It is important to plan childcare when I am away from my child at work.",
        type: goalBasis.once,
      },
      {
        name: "Research work-from-home jobs",
        description: "Work-from-home jobs would allow me to maintain my responsibilites at home while still working.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-53&redirect_to=subentity&gotopage[1137]=1", name: "Starting a Business" },
        ],
        type: goalBasis.once,
      },

      {
        name: "Practice talking with manager to ask for new schedule",
        description: "Preparing to talk with a manager will give me more confidence when asking for a new schedule.",
        type: goalBasis.daily,
        frequency: 3,
      },

      {
        name: "Ask friend(s) and family about job openings",
        description: "Friends or family can give insight on potential job openings that they know of.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Search online for jobs",
        description: "Searching online can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Check the newspaper for jobs",
        description: "Searching in the newspaper can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Spend time networking",
        description: "Networking can help me gain knowledge and advance my career.",
        type: goalBasis.daily,
      },
      {
        name: "Work on improving skills",
        description: "Improving skills can help me become more prepared and desirable in job searching.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-53&redirect_to=subentity&gotopage[1137]=1", name: "Starting a Business" },
        ],
        type: goalBasis.daily,
      },
      {
        name: "Submit an application to 2 job listings for steadier job",
        description: "Applying to a job listing allows me the chance of getting a job that meets my needs.",
        type: goalBasis.daily,
        frequency: 3,
      },
    ],
  },

  {
    id: "times i want",
    category: categories.jobs,
    subcategory: jobsSubcategories.schedule,
    name: "Work hours during time of day/night I want",
    sortOrder: 2,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=134", name: "Job Goals" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Update resume",
        description: "Updating my resume will display my new work experience, education, and skills.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=139", name: "Formatting Resume" }
        ],
        type: goalBasis.once,
      },
      {
        name: "Update cover letter",
        description: "Updating my cover letter will display my motivation, work history, and professional skills.",
        type: goalBasis.once,
      },
      {
        name: "Pick appropriate attire for interview",
        description: "Picking appropriate attire for my interview shows I am serious about the job and the interviewer's time.",
        type: goalBasis.once,
      },
      {
        name: "Look up employee testimonials on online job sites",
        description: "Employee testimonials on online job sites (such as LinkedIn, Glassdoor, etc) give me more insight and information on the job.",
        type: goalBasis.once,
      },
      {
        name: "Talk to company recruiter",
        description: "A company recruiter can give me information about the application process and the job.",
        type: goalBasis.once,
      },
      {
        name: "Map out schedule I would like",
        description: "Mapping out a schedule I would like would organize my work time with all my other responsibilities.",
        type: goalBasis.once,
      },
      {
        name: "Make appointment to talk with manager to ask for a new schedule",
        description: "Asking my manager for a new schedule will allow me to better organize my work time with all my other responsibilities.",
        type: goalBasis.once,
      },
      {
        name: "Prepare 5 interview questions",
        description: "Preparing 5 job interview questions will display my interest and reduce stress when asked.",
        type: goalBasis.once,
      },
      {
        name: "Plan childcare",
        description: "It is important to plan childcare when I am away from my child at work.",
        type: goalBasis.once,
      },
      {
        name: "Research work-from-home jobs",
        description: "Work-from-home jobs would allow me to maintain my responsibilites at home while still working.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-53&redirect_to=subentity&gotopage[1137]=1", name: "Starting a Business" },
        ],
        type: goalBasis.once,
      },

      {
        name: "Practice talking with manager to ask for new schedule",
        description: "Preparing to talk with a manager will give me more confidence when asking for a new schedule.",
        type: goalBasis.daily,
        frequency: 3,
      },

      {
        name: "Ask friend(s) and family about job openings",
        description: "Friends or family can give insight on potential job openings that they know of.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Search online for jobs",
        description: "Searching online can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Check the newspaper for jobs",
        description: "Searching in the newspaper can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Spend time networking",
        description: "Networking can help me gain knowledge and advance my career.",
        type: goalBasis.daily,
      },
      {
        name: "Work on improving skills",
        description: "Improving skills can help me become more prepared and desirable in job searching.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-53&redirect_to=subentity&gotopage[1137]=1", name: "Starting a Business" },
        ],
        type: goalBasis.daily,
      },
      {
        name: "Submit an application to 2 job listings for steadier job",
        description: "Applying to a job listing allows me the chance of getting a job that meets my needs.",
        type: goalBasis.daily,
        frequency: 3,
      },
    ],
  },

  {
    id: "hours i want",
    category: categories.jobs,
    subcategory: jobsSubcategories.schedule,
    name: "Number of work hours I want",
    sortOrder: 3,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=134", name: "Job Goals" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Update resume",
        description: "Updating my resume will display my new work experience, education, and skills.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=139", name: "Formatting Resume" }
        ],
        type: goalBasis.once,
      },
      {
        name: "Update cover letter",
        description: "Updating my cover letter will display my motivation, work history, and professional skills.",
        type: goalBasis.once,
      },
      {
        name: "Pick appropriate attire for interview",
        description: "Picking appropriate attire for my interview shows I am serious about the job and the interviewer's time.",
        type: goalBasis.once,
      },
      {
        name: "Look up employee testimonials on online job sites",
        description: "Employee testimonials on online job sites (such as LinkedIn, Glassdoor, etc) give me more insight and information on the job.",
        type: goalBasis.once,
      },
      {
        name: "Talk to company recruiter",
        description: "A company recruiter can give me information about the application process and the job.",
        type: goalBasis.once,
      },
      {
        name: "Map out schedule I would like",
        description: "Mapping out a schedule I would like would organize my work time with all my other responsibilities.",
        type: goalBasis.once,
      },
      {
        name: "Make appointment to talk with manager to ask for a new schedule",
        description: "Asking my manager for a new schedule will allow me to better organize my work time with all my other responsibilities.",
        type: goalBasis.once,
      },
      {
        name: "Prepare 5 interview questions",
        description: "Preparing 5 job interview questions will display my interest and reduce stress when asked.",
        type: goalBasis.once,
      },

      {
        name: "Practice talking with manager to ask for new schedule",
        description: "Preparing to talk with a manager will give me more confidence when asking for a new schedule.",
        type: goalBasis.daily,
        frequency: 3,
      },

      {
        name: "Ask friend(s) and family about job openings",
        description: "Friends or family can give insight on potential job openings that they know of.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Search online for jobs",
        description: "Searching online can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Check the newspaper for jobs",
        description: "Searching in the newspaper can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Spend time networking",
        description: "Networking can help me gain knowledge and advance my career.",
        type: goalBasis.daily,
      },
      {
        name: "Work on improving skills",
        description: "Improving skills can help me become more prepared and desirable in job searching.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-53&redirect_to=subentity&gotopage[1137]=1", name: "Starting a Business" },
        ],
        type: goalBasis.daily,
      },
      {
        name: "Submit an application to 2 job listings with number of hours I want",
        description: "Applying to a job listing allows me the chance of getting a job that meets my needs.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Prepare for job interview",
        description: "Preparing for a job interview will improve my chances and confidence in the interview.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=140", name: "Steps to Prepare for Job Interview" }
        ],
        type: goalBasis.weekly,
      },
    ],
  },

  {
    id: "positive difference",
    category: categories.jobs,
    subcategory: jobsSubcategories.enjoyment,
    name: "I make a positive difference",
    sortOrder: 1,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=134", name: "Job Goals" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Update resume",
        description: "Updating my resume will display my new work experience, education, and skills.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=139", name: "Formatting Resume" }
        ],
        type: goalBasis.once,
      },
      {
        name: "Update cover letter",
        description: "Updating my cover letter will display my motivation, work history, and professional skills.",
        type: goalBasis.once,
      },
      {
        name: "Pick appropriate attire for interview",
        description: "Picking appropriate attire for my interview shows I am serious about the job and the interviewer's time.",
        type: goalBasis.once,
      },
      {
        name: "Look up employee testimonials on online job sites",
        description: "Employee testimonials on online job sites (such as LinkedIn, Glassdoor, etc) give me more insight and information on the job.",
        type: goalBasis.once,
      },
      {
        name: "Prepare 5 interview questions",
        description: "Preparing 5 job interview questions will display my interest and reduce stress when asked.",
        type: goalBasis.once,
      },

      {
        name: "Ask friend(s) and family about job openings",
        description: "Friends or family can give insight on potential job openings that they know of.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Search online for jobs",
        description: "Searching online can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Check the newspaper for jobs",
        description: "Searching in the newspaper can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Spend time networking",
        description: "Networking can help me gain knowledge and advance my career.",
        type: goalBasis.daily,
      },
      {
        name: "Work on improving skills",
        description: "Improving skills can help me become more prepared and desirable in job searching.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-53&redirect_to=subentity&gotopage[1137]=1", name: "Starting a Business" },
        ],
        type: goalBasis.daily,
      },
      {
        name: "Submit an application to 2 job listings",
        description: "Applying to a job listing allows me the chance of getting a job that meets my needs.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Prepare for job interview",
        description: "Preparing for a job interview will improve my chances and confidence in the interview.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=140", name: "Steps to Prepare for Job Interview" }
        ],
        type: goalBasis.weekly,
      },
      {
        name: "Reflect, talk to fellow co-workers, friends and family",
        description: "Reflecting and talking to co-workers, friends, and family can reduce stress and help me understand situations better.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-53&redirect_to=subentity&gotopage[1137]=1", name: "Starting a Business" },
        ],
        type: goalBasis.daily,
        frequency: 3,
      },
    ],
  },

  {
    id: "enjoy coworkers",
    category: categories.jobs,
    subcategory: jobsSubcategories.enjoyment,
    name: "I enjoy my coworkers",
    sortOrder: 2,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=134", name: "Job Goals" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Update resume",
        description: "Updating my resume will display my new work experience, education, and skills.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=139", name: "Formatting Resume" }
        ],
        type: goalBasis.once,
      },
      {
        name: "Update cover letter",
        description: "Updating my cover letter will display my motivation, work history, and professional skills.",
        type: goalBasis.once,
      },
      {
        name: "Pick appropriate attire for interview",
        description: "Picking appropriate attire for my interview shows I am serious about the job and the interviewer's time.",
        type: goalBasis.once,
      },
      {
        name: "Look up employee testimonials on online job sites",
        description: "Employee testimonials on online job sites (such as LinkedIn, Glassdoor, etc) give me more insight and information on the job.",
        type: goalBasis.once,
      },
      {
        name: "Prepare 5 interview questions",
        description: "Preparing 5 job interview questions will display my interest and reduce stress when asked.",
        type: goalBasis.once,
      },

      {
        name: "Ask friend(s) and family about job openings",
        description: "Friends or family can give insight on potential job openings that they know of.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Search online for jobs",
        description: "Searching online can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Check the newspaper for jobs",
        description: "Searching in the newspaper can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Spend time networking",
        description: "Networking can help me gain knowledge and advance my career.",
        type: goalBasis.daily,
      },
      {
        name: "Work on improving skills",
        description: "Improving skills can help me become more prepared and desirable in job searching.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-53&redirect_to=subentity&gotopage[1137]=1", name: "Starting a Business" },
        ],
        type: goalBasis.daily,
      },
      {
        name: "Submit an application to 2 job listings",
        description: "Applying to a job listing allows me the chance of getting a job that meets my needs.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Prepare for job interview",
        description: "Preparing for a job interview will improve my chances and confidence in the interview.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=140", name: "Steps to Prepare for Job Interview" }
        ],
        type: goalBasis.weekly,
      },
      {
        name: "Reflect, talk to fellow co-workers, friends and family",
        description: "Reflecting and talking to co-workers, friends, and family can reduce stress and help me understand situations better.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-53&redirect_to=subentity&gotopage[1137]=1", name: "Starting a Business" },
        ],
        type: goalBasis.daily,
        frequency: 3,
      },
    ],
  },

  {
    id: "feel appreciated",
    category: categories.jobs,
    subcategory: jobsSubcategories.enjoyment,
    name: "I feel appreciated and valued",
    sortOrder: 3,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=134", name: "Job Goals" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Update resume",
        description: "Updating my resume will display my new work experience, education, and skills.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=139", name: "Formatting Resume" }
        ],
        type: goalBasis.once,
      },
      {
        name: "Update cover letter",
        description: "Updating my cover letter will display my motivation, work history, and professional skills.",
        type: goalBasis.once,
      },
      {
        name: "Pick appropriate attire for interview",
        description: "Picking appropriate attire for my interview shows I am serious about the job and the interviewer's time.",
        type: goalBasis.once,
      },
      {
        name: "Look up employee testimonials on online job sites",
        description: "Employee testimonials on online job sites (such as LinkedIn, Glassdoor, etc) give me more insight and information on the job.",
        type: goalBasis.once,
      },
      {
        name: "Schedule a meeting with manager",
        type: goalBasis.once,
      },
      {
        name: "Prepare 5 interview questions",
        description: "Preparing 5 job interview questions will display my interest and reduce stress when asked.",
        type: goalBasis.once,
      },

      {
        name: "Ask friend(s) and family about job openings",
        description: "Friends or family can give insight on potential job openings that they know of.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Search online for jobs",
        description: "Searching online can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Check the newspaper for jobs",
        description: "Searching in the newspaper can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Spend time networking",
        description: "Networking can help me gain knowledge and advance my career.",
        type: goalBasis.daily,
      },
      {
        name: "Work on improving skills",
        description: "Improving skills can help me become more prepared and desirable in job searching.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-53&redirect_to=subentity&gotopage[1137]=1", name: "Starting a Business" },
        ],
        type: goalBasis.daily,
      },
      {
        name: "Submit an application to 2 job listings",
        description: "Applying to a job listing allows me the chance of getting a job that meets my needs.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Prepare for job interview",
        description: "Preparing for a job interview will improve my chances and confidence in the interview.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=140", name: "Steps to Prepare for Job Interview" }
        ],
        type: goalBasis.weekly,
      },
      {
        name: "Reflect, talk to fellow co-workers, friends and family",
        description: "Reflecting and talking to co-workers, friends, and family can reduce stress and help me understand situations better.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-53&redirect_to=subentity&gotopage[1137]=1", name: "Starting a Business" },
        ],
        type: goalBasis.daily,
        frequency: 3,
      },
    ],
  },

  {
    id: "love what i do",
    category: categories.jobs,
    subcategory: jobsSubcategories.enjoyment,
    name: "I love what I do",
    sortOrder: 4,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=134", name: "Job Goals" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Update resume",
        description: "Updating my resume will display my new work experience, education, and skills.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=139", name: "Formatting Resume" }
        ],
        type: goalBasis.once,
      },
      {
        name: "Update cover letter",
        description: "Updating my cover letter will display my motivation, work history, and professional skills.",
        type: goalBasis.once,
      },
      {
        name: "Pick appropriate attire for interview",
        description: "Picking appropriate attire for my interview shows I am serious about the job and the interviewer's time.",
        type: goalBasis.once,
      },
      {
        name: "Schedule meeting with manager",
        description: "Meeting with the manager will allow me to learn about the job's responsibilities and expectations.",
        type: goalBasis.once,
      },
      {
        name: "Prepare 5 interview questions",
        description: "Preparing 5 job interview questions will display my interest and reduce stress when asked.",
        type: goalBasis.once,
      },

      {
        name: "Ask friend(s) and family about job openings",
        description: "Friends or family can give insight on potential job openings that they know of.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Search online for jobs",
        description: "Searching online can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Check the newspaper for jobs",
        description: "Searching in the newspaper can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Spend time networking",
        description: "Networking can help me gain knowledge and advance my career.",
        type: goalBasis.daily,
      },
      {
        name: "Work on improving skills",
        tdescription: "Improving skills can help me become more prepared and desirable in job searching.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-53&redirect_to=subentity&gotopage[1137]=1", name: "Starting a Business" },
        ],
        type: goalBasis.daily,
      },
      {
        name: "Submit an application to 2 job listings",
        description: "Applying to a job listing allows me the chance of getting a job that meets my needs.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Prepare for job interview",
        description: "Preparing for a job interview will improve my chances and confidence in the interview.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=140", name: "Steps to Prepare for Job Interview" }
        ],
        type: goalBasis.weekly,
      },
      {
        name: "Reflect, talk to fellow co-workers, friends and family",
        description: "Reflecting and talking to co-workers, friends, and family can reduce stress and help me understand situations better.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-53&redirect_to=subentity&gotopage[1137]=1", name: "Starting a Business" },
        ],
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Practice for meeting with manager about different responsibilities",
        description: "Preparing to talk with a manager will give me more confidence when asking about different responsibilities",
        type: goalBasis.weekly,
      },
    ],
  },

  {
    id: "challenges me",
    category: categories.jobs,
    subcategory: jobsSubcategories.enjoyment,
    name: "It challenges me to grow",
    sortOrder: 5,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=134", name: "Job Goals" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Update resume",
        description: "Updating my resume will display my new work experience, education, and skills.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=139", name: "Formatting Resume" }
        ],
        type: goalBasis.once,
      },
      {
        name: "Update cover letter",
        description: "Updating my cover letter will display my motivation, work history, and professional skills.",
        type: goalBasis.once,
      },
      {
        name: "Pick appropriate attire for interview",
        description: "Picking appropriate attire for my interview shows I am serious about the job and the interviewer's time.",
        type: goalBasis.once,
      },
      {
        name: "Schedule meeting with manager",
        description: "Meeting with the manager will allow me to learn about the job's responsibilities and expectations.",
        type: goalBasis.once,
      },
      {
        name: "Prepare 5 interview questions",
        description: "Preparing 5 job interview questions will display my interest and reduce stress when asked.",
        type: goalBasis.once,
      },

      {
        name: "Ask friend(s) and family about job openings",
        description: "Friends or family can give insight on potential job openings that they know of.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Search online for jobs",
        description: "Searching online can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Check the newspaper for jobs",
        description: "Searching in the newspaper can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Spend time networking",
        description: "Networking can help me gain knowledge and advance my career.",
        type: goalBasis.daily,
      },
      {
        name: "Work on improving skills",
        description: "Improving skills can help me become more prepared and desirable in job searching.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-53&redirect_to=subentity&gotopage[1137]=1", name: "Starting a Business" },
        ],
        type: goalBasis.daily,
      },
      {
        name: "Submit an application to 2 job listings",
        description: "Applying to a job listing allows me the chance of getting a job that meets my needs.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Prepare for job interview",
        description: "Preparing for a job interview will improve my chances and confidence in the interview.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=140", name: "Steps to Prepare for Job Interview" }
        ],
        type: goalBasis.weekly,
      },
      {
        name: "Reflect, talk to fellow co-workers, friends and family",
        description: "Reflecting and talking to co-workers, friends, and family can reduce stress and help me understand situations better.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-53&redirect_to=subentity&gotopage[1137]=1", name: "Starting a Business" },
        ],
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Practice for meeting with manager about different responsibilities",
        description: "Preparing to talk with a manager will give me more confidence when asking about different responsibilities",
        type: goalBasis.weekly,
      },
    ],
  },

  {
    id: "fits personality",
    category: categories.jobs,
    subcategory: jobsSubcategories.enjoyment,
    name: "It fits my personality",
    sortOrder: 6,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=134", name: "Job Goals" },
    ],
    measures: {
      type: measureData.none,
      startLabel: "",
      endLabel: "",
      unit: "",
      placeholderStartValue: "---",
      placeholderEndValue: "---",
    },
    goals: [
      {
        name: "Update resume",
        description: "Updating my resume will display my new work experience, education, and skills.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=139", name: "Formatting Resume" }
        ],
        type: goalBasis.once,
      },
      {
        name: "Update cover letter",
        description: "Updating my cover letter will display my motivation, work history, and professional skills.",
        type: goalBasis.once,
      },
      {
        name: "Pick appropriate attire for interview",
        description: "Picking appropriate attire for my interview shows I am serious about the job and the interviewer's time.",
        type: goalBasis.once,
      },
      {
        name: "Schedule meeting with manager",
        description: "Meeting with the manager will allow me to learn about the job's responsibilities and expectations.",
        type: goalBasis.once,
      },
      {
        name: "Prepare 5 interview questions",
        description: "Preparing 5 job interview questions will display my interest and reduce stress when asked.",
        type: goalBasis.once,
      },

      {
        name: "Ask friend(s) and family about job openings",
        description: "Friends or family can give insight on potential job openings that they know of.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Search online for jobs",
        description: "Searching online can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Check the newspaper for jobs",
        description: "Searching in the newspaper can help me find a job that meets my needs.",
        type: goalBasis.daily,
      },
      {
        name: "Spend time networking",
        description: "Networking can help me gain knowledge and advance my career.",
        type: goalBasis.daily,
      },
      {
        name: "Work on improving skills",
        description: "Improving skills can help me become more prepared and desirable in job searching.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-53&redirect_to=subentity&gotopage[1137]=1", name: "Starting a Business" },
        ],
        type: goalBasis.daily,
      },
      {
        name: "Submit an application to 2 job listings",
        description: "Applying to a job listing allows me the chance of getting a job that meets my needs.",
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Prepare for job interview",
        description: "Preparing for a job interview will improve my chances and confidence in the interview.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=140", name: "Steps to Prepare for Job Interview" }
        ],
        type: goalBasis.weekly,
      },
      {
        name: "Reflect, talk to fellow co-workers, friends and family",
        description: "Reflecting and talking to co-workers, friends, and family can reduce stress and help me understand situations better.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-53&redirect_to=subentity&gotopage[1137]=1", name: "Starting a Business" },
        ],
        type: goalBasis.daily,
        frequency: 3,
      },
      {
        name: "Practice for meeting with manager about different responsibilities",
        description: "Preparing to talk with a manager will give me more confidence when asking about different responsibilities",
        type: goalBasis.weekly,
      },
    ],
  },

  /* Start Of Money Management Milestones*/

  {
    id: "financial plan",
    category: categories.money,
    subcategory: moneySubcategories.budgeting,
    name: "Make a financial plan for the future",
    sortOrder: 1,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=109", name: "Budgeting/Spending" },
    ],
    measures: {
      type: measureData.none,
    },
    goals: [
      {
        name: "Make a list of needs & wants",
        description: "Making a list of needs and wants will help me differentiate items that I am looking to purchase.",
        type: goalBasis.once
      },
      {
        name: "Build my six-month budget",
        description: "Building a six-month budget will allow me to allocate money to purchase what I need and save for six months.",
        type: goalBasis.once
      },
      {
        name: "Talk to family about budget planning",
        description: "My family can help me with budget planning because they also know my needs and purchases.",
        type: goalBasis.once
      },
      {
        name: "Plan for emergency fund",
        description: "An emergency fund can help me from sinking financially in cases of emergency.",
        type: goalBasis.once
      },
      {
        name: "Plan for monthly payment(s) towards debt",
        description: "Planning for monthly payment(s) towards debt will allow me to arrange enough money to pay my debts on time.",
        type: goalBasis.once
      },
      {
        name: "Plan for saving  beyond emergency fund",
        description: "Saving beyond emergency fund will alow me to have money for convenience and any costly emergency.",
        type: goalBasis.once
      },
      {
        name: "Find a financial advisor (free and trusted program at non-profit org., library, church, etc.)",
        description: "A financial advisor can provide me financial services based on my current financial situation. (free and trusted program at non-profit org., library, church, etc.)",
        type: goalBasis.once
      },
      {
        name: "Enroll in trusted online financial literacy program",
        description: "Learning to become financial literate will help me with current responsibilities and to make better financial decisions in the future.",
        type: goalBasis.once
      },
      {
        name: "Make budget spreadsheet",
        description: "Making a budget spreadsheet allows me to plan all my necessary payments and expenses.",
        type: goalBasis.once
      },
      {
        name: "Use trusted online budget service without linking accounts",
        description: "A trusted online budget service can help me plan and allocate all my money for all my necessary payments.",
        type: goalBasis.once
      },
      {
        name: "Link accounts with trusted online budget service",
        description: "A trusted online budget service can help me plan and allocate all my money for all my necessary payments.",
        type: goalBasis.once
      },
      {
        name: "Record my income and expenses for the day",
        description: "Keeping track of finances daily can help me budget and plan for the future.",
        type: goalBasis.daily
      },
      {
        name: "Do 30 minutes in trusted online financial literacy course",
        description: "Learning to become financially literate will help me with current responsibilities and help me make better financial decisions in the future.",
        type: goalBasis.daily
      },
    ],
  },

  {
    id: "create budgets",
    category: categories.money,
    subcategory: moneySubcategories.budgeting,
    name: "Create and stick to monthly and weekly budgets",
    sortOrder: 2,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=109", name: "Budgeting/Spending" },
    ],
    measures: {
      type: measureData.none,
    },
    goals: [
      {
        name: "Make a list of needs & wants",
        description: "Making a list of needs and wants will help me differentiate items that I am looking to purchase.",
        type: goalBasis.once
      },
      {
        name: "Build my monthly budget",
        description: "Building a monthly budget will allow me to allocate money to purchase what I need and save for a month.",
        type: goalBasis.once
      },
      {
        name: "Build my weekly budget",
        description: "Building a weekly budget will allow me to allocate money to purchase what I need and save for a week.",
        type: goalBasis.once
      },
      {
        name: "Make sure to include items that occur less often than monthly",
        description: "It is important to consider and financially plan for items that occur less often than monthly.",
        type: goalBasis.once
      },
      {
        name: "Talk to family about budget planning",
        description: "My family can help me with budget planning because they also know my needs and purchases.",
        type: goalBasis.once
      },
      {
        name: "Enroll in trusted online financial literacy program",
        description: "Learning to become financial literate will help me with current responsibilities and to make better financial decisions in the future.",
        type: goalBasis.once
      },
      {
        name: "Ask financial advisor (free program at non-profit org., library, church, etc.) about budgeting",
        description: "A financial advisor (free program at non-profit org., library, church, etc.) can inform me about budgeting and how to make a financial plan for a period of time.",
        type: goalBasis.once
      },
      {
        name: "Record my income and expenses as they occur",
        description: "Keeping track of finances as they can occur can help me budget and plan for the future.",
        type: goalBasis.daily
      },
      {
        name: "Do 30 minutes in trusted online financial literacy course",
        description: "Learning to become financially literate will help me with current responsibilities and help me make better financial decisions in the future.",
        type: goalBasis.daily
      },
      {
        name: "Comparison items before purchasing",
        description: "Comparison shopping will help me find the best priced item and save me money.",
        type: goalBasis.daily
      },
    ],
  },

  {
    id: "child support",
    category: categories.money,
    subcategory: moneySubcategories.budgeting,
    name: "Participate in financial child support",
    sortOrder: 3,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=186", name: "Child Support" },
    ],
    measures: {
      type: measureData.none,
    },
    goals: [
      {
        name: "Include child support in current budget",
        description: "It is important to arrange money to fufil my commitments for child child support in current budget.",
        type: goalBasis.once
      },
      {
        name: "Consider different payment options",
        description: "Considering different payment options (Venmo, Zell, etc) will help me choose how to pay child support.",
        type: goalBasis.once
      },
      {
        name: "Choose best payment option",
        description: "Choosing best payment option (Venmo, Zell, etc) will give me a secure way and consistent way to pay child support.",
        type: goalBasis.once
      },
      {
        name: "Contact Child Support Services or family law attorney for assistance or questions",
        description: "Child Support Services or family law attorneys can offer clarification and answer any questions I have  regarding child support.",
        type: goalBasis.once
      },
      {
        name: "Contact Child Support Services or family law attorney if trying to modify child support order",
        description: "Contacting Child Support Services or family law attorney can help me and inform me in the process of modifying child support order.",
        type: goalBasis.once
      },
      {
        name: "Communicate with other parent about payment schedule",
        description: "Communicating with the other parent about payment schedule (in-person, through text, through a lawyer, etc) can help prevent future financial conflicts.",
        type: goalBasis.weekly
      },
      {
        name: "Keep updated on state's child support guidelines",
        description: "It is important to know the state's child support guidelines to view if there are any changes or violations.",
        type: goalBasis.monthly,
        days: [1]
      },
      {
        name: "Make child support payment",
        description: "Making child support payments will help support my child's needs and wellbeing.",
        type: goalBasis.monthly,
        days: [1]
      },
      {
        name: "Check that I received child support payment",
        description: "Checking if the child support payment is received will keep track of the money needed for the child.",
        type: goalBasis.monthly,
        days: [1]
      },
      {
        name: "Check that parent or guardian received child support payment",
        description: "Checking if the child support payment is received will keep track of the money needed for the child.",
        type: goalBasis.monthly,
        days: [1]
      },
      {
        name: "Check that parent or guardian made child support payment",
        description: "Checking if the child support payment is made will keep track of the money needed for the child.",
        type: goalBasis.monthly,
        days: [1]
      },
    ],
  },

  {
    id: "identification documents",
    category: categories.money,
    subcategory: moneySubcategories.programs,
    name: "Establish necessary identification documents",
    sortOrder: 1,
    links: [
      { url: "", name: "" },
    ],
    measures: {
      type: measureData.none,
    },
    goals: [
      {
        name: "Identify programs that would match my needs",
        description: "Many programs fufil different needs and I should make sure the program I intend to apply to fufils my needs,",
        type: goalBasis.once
      },
      {
        name: "Make a list of each program's required identification documents",
        description: "It is important when looking to apply to any program that I am prepared with the required identification documents so I can apply.",
        type: goalBasis.once
      },
      {
        name: "Contact program representative with questions",
        description: "Contacting a program representative with questions will allow me to clarify any questions I have on the application process and eligibility.",
        type: goalBasis.once
      },
      {
        name: "Organize required identification documents",
        description: "It is important when looking to apply to any program that I am prepared with the required identification documents so I can apply.",
        type: goalBasis.once
      },
      {
        name: "Sign-up for driving test ",
        description: "Signing-up for a driving test will help me get my driver's license.",
        type: goalBasis.once
      },
      {
        name: "Contact state department of vital records",
        description: "Contacting state department of vital records will help me get my birth certificate.",
        type: goalBasis.once
      },
    ],
  },

  {
    id: "SNAP",
    category: categories.money,
    subcategory: moneySubcategories.programs,
    name: "Apply for SNAP",
    sortOrder: 2,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=182", name: "Food Assistance" },
    ],
    measures: {
      type: measureData.none,
    },
    goals: [
      {
        name: "Make a budget of current needs and spending",
        description: "Building a budget will allow me to allocate money to purchase what I need based on my spending.",
        type: goalBasis.once
      },
      {
        name: "Make a list of needs",
        description: "Making a list of needs (based on current income, spending, etc) will help me create a list of items I need to budget for.",
        type: goalBasis.once
      },
      {
        name: "Check that SNAP matches my needs",
        description: "SNAP offers many different items and food and it is important to check if any match my needs.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-47", name: "Provider Corner/SNAP Benefits" },
        ],
        type: goalBasis.once
      },
      {
        name: "Research state eligibility requirements",
        description: "Researching state eligibility requirements (resource and income limits, etc) will inform me if I can apply for SNAP.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-47", name: "Provider Corner/SNAP Benefits" },
        ],
        type: goalBasis.once
      },
      {
        name: "Check that I match state's eligibility requirements",
        description: "Checking that I match state's eligibility requirements (resource and income limits, etc) will inform me if I am elgible to receive SNAP benefits.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-47", name: "Provider Corner/SNAP Benefits" },
        ],
        type: goalBasis.once
      },
      {
        name: "Call state's SNAP information hotline with questions",
        description: "The SNAP information hotline can answer my questions about eligibility and clarify any other concerns.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-47", name: "Provider Corner/SNAP Benefits" },
        ],
        type: goalBasis.once
      },
      {
        name: "Visit state agency's website for more information",
        description: "Visiting the state's agency website for more information about SNAP will clarify me on the application process and answer any questions I have.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-47", name: "Provider Corner/SNAP Benefits" },
        ],
        type: goalBasis.once
      },
      {
        name: "Submit state's SNAP application",
        description: "SNAP offers me food-purchasing assistance if I am eleigible and apply in my state.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-47", name: "Provider Corner/SNAP Benefits" },
        ],
        type: goalBasis.once
      },
      {
        name: "Do eligibility interview",
        description: "A SNAP interview will tell me if I am eligible for SNAP benefits.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-47", name: "Provider Corner/SNAP Benefits" },
        ],
        type: goalBasis.once
      },
      {
        name: "After certification period ends, apply to recertify to continue receiving SNAP benefits",
        description: "SNAP will continue to provide me food-purchasing assistance if I apply to rectify to continue receiving SNAP benefits.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-47", name: "Provider Corner/SNAP Benefits" },
        ],
        type: goalBasis.once
      },
      {
        name: "Contact local SNAP office with questions",
        description: "Contracting local SNAP office with questions will clarify me on the application process and answer any questions I have.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-47", name: "Provider Corner/SNAP Benefits" },
        ],
        type: goalBasis.once
      },
      {
        name: "Request a fair hearing with an official",
        description: "SNAP will continue to provide me food-purchasing assistance if I apply to rectify to continue receiving SNAP benefits.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-47", name: "Provider Corner/SNAP Benefits" },
        ],
        type: goalBasis.once
      },
    ],
  },

  {
    id: "WIC",
    category: categories.money,
    subcategory: moneySubcategories.programs,
    name: "Apply for WIC",
    sortOrder: 3,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=182", name: "Food Assistance" },
    ],
    measures: {
      type: measureData.none,
    },
    goals: [
      {
        name: "Make a budget of current needs and spending",
        description: "Building a budget will allow me to allocate money to purchase what I need based on my spending.",
        type: goalBasis.once
      },
      {
        name: "Make a list of needs",
        description: "Making a list of needs (based on current income, spending, etc) will help me create a list of items I need to budget for.",
        type: goalBasis.once
      },
      {
        name: "Check that WIC matches my needs",
        description: "WIC (Women, Infants, and Children) offers many different items and food and it is important to check if any match my needs.",
        links: [
          { url: "https://www.fns.usda.gov/wic/wic-how-apply", name: "How to Apply to WIC" },
        ],
        type: goalBasis.once
      },
      {
        name: "Contact state or local agency to set up an appointment",
        description: "A WIC (Women, Infants, and Children) appointment will tell me if my child/ren are elegible for WIC services.",
        links: [
          { url: "https://www.fns.usda.gov/wic/wic-how-apply", name: "How to Apply to WIC" },
        ],
        type: goalBasis.once
      },
      {
        name: "Research state eligibility requirements",
        description: "It is important to know my state's eligibility requirements (category, residency, income, nutrition risk, etc) when applying for WIC (Women, Infants, and Children).",
        links: [
          { url: "https://www.fns.usda.gov/wic/wic-how-apply", name: "How to Apply to WIC" },
        ],
        type: goalBasis.once
      },
      {
        name: "Check that I match state's eligibility requirements",
        description: "It is important to know when applying for WIC (Women, Infants, and Children) that I match state's eligibility requirements (category, residency, income, nutrition risk, etc).",
        links: [
          { url: "https://www.fns.usda.gov/wic/wic-how-apply", name: "How to Apply to WIC" },
        ],
        type: goalBasis.once
      },
      {
        name: "Bring all required materials to WIC appointment",
        description: "It is important ot have all required materials when going to my WIC (Women, Infants, and Children) appointment to receive assistance.",
        links: [
          { url: "https://www.fns.usda.gov/wic/wic-how-apply", name: "How to Apply to WIC" },
        ],
        type: goalBasis.once
      },
    ],
  },

  {
    id: "relevant programs",
    category: categories.money,
    subcategory: moneySubcategories.programs,
    name: "Participate in relevant income programs",
    sortOrder: 4,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=182", name: "Food Assistance" },
    ],
    measures: {
      type: measureData.none,
    },
    goals: [
      {
        name: "Make a budget of current needs and spending",
        description: "Building a budget will allow me to allocate money to purchase what I need based on my spending.",
        type: goalBasis.once
      },
      {
        name: "Make a list of needs",
        description: "Making a list of needs (based on current income, spending, etc) will help me create a list of items I need to budget for.",
        type: goalBasis.once
      },
      {
        name: "Research state and federal programs",
        description: "State and federal programs often have differnet requirements for food assisntance and income programs.",
        type: goalBasis.once
      },
      {
        name: "Identify programs that would match my needs",
        description: "A program that matches my needs will support me financially and with food assistance.",
        type: goalBasis.once
      },
      {
        name: "Check program eligibility requirements",
        description: "It is important to know when applying to a program that I meet the program's eligibility requirements (income level, residency requirements, etc).",
        type: goalBasis.once
      },
      {
        name: "Make a list of each program's required identification documents",
        description: "It is important ot have all required identification documents when applying to a program for financial or food assistance.",
        type: goalBasis.once
      },
      {
        name: "Contact program representative with questions",
        description: "Contacting program representative with questions will allow me to clarify any concerns I have with the program.",
        type: goalBasis.once
      },
      {
        name: "Apply to programs that would match my needs",
        description: "A program that matches my needs will support me financially and with food assistance.",
        type: goalBasis.once
      },
    ],
  },

  {
    id: "reduce debt",
    category: categories.money,
    subcategory: moneySubcategories.personal,
    name: "Plan to reduce debt",
    sortOrder: 1,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=111", name: "Saving" },
    ],
    measures: {
      type: measureData.none,
    },
    goals: [
      {
        name: "Talk to family or friend(s) about reducing debt",
        description: "Family or friend(s) can give me advice and guidance on how to reduce my debt.",
        type: goalBasis.once
      },
      {
        name: 'Avoid "payday loans"',
        description: "'Payday loans' are short-term unsecured loans with high interest rates.",
        type: goalBasis.once
      },
      {
        name: "List the interest rates on my credit cards",
        description: "It is important to know the interest rates on my credit cards before I use them.",
        type: goalBasis.once
      },
      {
        name: "Ask financial advisor about reducing debt",
        description: "A financial advisor (free program at non-profit org., library, church, etc.) can inform me on how to reduce debt.",
        type: goalBasis.once
      },
      {
        name: "Brainstorm with a trusted advisor about creative ways to make more money",
        description: "Brainstorming with a trusted advisor about creative ways to make more money will give me more financial freedom and help me pay my debts.",
        type: goalBasis.once
      },
      {
        name: "Brainstorm with a trusted advisor about areas to cut back",
        description: "Brainstorming with a trusted advisor about areas to cut back (stop buying coffee out, switching to a cheaper phone plan, etc) will give me more financial freedom and help me pay my debts.",
        type: goalBasis.once
      },
      {
        name: "Learn about Dave Ramsey's 'Debt Snowball'",
        description: "A 'debt snowball' is a debt-reduction strategy where you pay off debts in order of smallest to largest.",
        type: goalBasis.once
      },
      {
        name: "Consider credit card interest rate before using card",
        description: "It is important to know the financial ramifications of using a credit card to help me make an educated decision.",
        type: goalBasis.daily
      },
      {
        name: "Track credit card payments",
        description: "Late credit card payments lower your credit score and increase insurance rates.",
        type: goalBasis.daily
      },
      {
        name: "Save enough to pay $10 more than minimum payment on credit card each month",
        description: "It is important to save enough to pay my credit card monthly without issue.",
        type: goalBasis.monthly
      },
      {
        name: "Pay credit cards on time",
        description: "Late credit card payments lower your credit score and increase insurance rates.",
        type: goalBasis.monthly
      },
      {
        name: "Pay student loans on time",
        description: "Paying students loans late will often cause additional fees.",
        type: goalBasis.monthly
      },
      {
        name: "Pay more than minimum on highest rate credit cards",
        description: "Paying more than minimum on highest rate credit cards helps me pay off my credit card balances faster and reduces my credit utilization ratio.",
        type: goalBasis.monthly
      },
    ],
  },

  {
    id: "overdraft",
    category: categories.money,
    subcategory: moneySubcategories.personal,
    name: "Exit OverDraft",
    sortOrder: 2,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=190", name: "Overdraft" },
    ],
    measures: {
      type: measureData.none,
    },
    goals: [
      {
        name: "Make list of payments due and income expected (use paper or computer)",
        description: "Planning for payments based on income will allow me to become financially prepared and make better decisions.",
        type: goalBasis.once
      },
      {
        name: "Set up overdraft protection",
        description: "Overdraft protection prevents check, ATM, or debit card transactions from causing the account to fall below zero resulting in an overdraft fee.",
        type: goalBasis.once
      },
      {
        name: "Schedule appointment at bank",
        description: "Scheduling an appointment at a bank can allow me to gain information about different bank accounts and programs offered.",
        type: goalBasis.once
      },
      {
        name: "Refer to list of payments due and income expected",
        description: "Planning for payments based on income will allow me to become financially prepared and make better decisions.",
        type: goalBasis.weekly
      },
    ],
  },

  {
    id: "checking account",
    category: categories.money,
    subcategory: moneySubcategories.personal,
    name: "Establish checking account at bank",
    sortOrder: 3,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=189", name: "Checking and Savings Accounts" },
    ],
    measures: {
      type: measureData.none,
    },
    goals: [
      {
        name: "Ask financial advisor about banks",
        description: "A financial advisor (free program at non-profit org., library, church, etc.) can inform me on about banks and different accounts.",
        type: goalBasis.once
      },
      {
        name: "Research banks for favorable programs",
        description: "Researching banks for favorable programs (low-cost checking, available ATMs, etc.) will help me make an educated decision.",
        type: goalBasis.once
      },
      {
        name: "Schedule appointment at bank",
        description: "Scheduling an appointment at a bank can allow me to gain information about different bank accounts and programs offered.",
        type: goalBasis.once
      },
    ],
  },

  {
    id: "emergency fund",
    category: categories.money,
    subcategory: moneySubcategories.personal,
    name: "Establish Emergency Fund",
    sortOrder: 4,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=110", name: "Financial Goals" },
      { url: "ourreach/index.php?module=ext/ipages/view&id=111", name: "Saving" },
    ],
    measures: {
      type: measureData.none,
    },
    goals: [
      {
        name: "Open savings account",
        description: "Savings account are a safe place to hold cash that earns interest.",
        type: goalBasis.once
      },
      {
        name: "Schedule appointment at bank",
        description: "Scheduling an appointment at a bank can allow me to gain information about different bank accounts and programs offered.",
        type: goalBasis.once
      },
      {
        name: 'Find "introductory interest-free repayment" credit card to use just in emergencies',
        description: "An 'introductory interest-free repayment' credit card to is a way to plan for emergency payments during unexpected situations.",
        type: goalBasis.once
      },
      {
        name: "Put 5% of every paycheck into emergency fund",
        description: "An emergency fund can help me from sinking financially in cases of emergency.",
        type: goalBasis.weekly,
        days: {
          fri: [17 * 60 * 60],
        }
      },
    ],
  },

  {
    id: "credit",
    category: categories.money,
    subcategory: moneySubcategories.personal,
    name: "Establish good credit",
    sortOrder: 5,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=112", name: "Credit/Loans" },
    ],
    measures: {
      type: measureData.none,
    },
    goals: [
      {
        name: "Ask financial advisor about building good credit",
        description: "A financial advisor (free program at non-profit org., library, church, etc.) can inform me on the steps to take to build good credit.",
        type: goalBasis.once
      },
      {
        name: "Research banks for favorable credit cards with low interest",
        description: "A bank with favorable credit cards with low interest rates will benefit me financially and save me money.",
        type: goalBasis.once
      },
      {
        name: "Schedule appointment at bank",
        description: "Scheduling an appointment at a bank can allow me to gain information about different bank accounts and programs offered.",
        type: goalBasis.once
      },
      {
        name: 'Avoid "payday loans"',
        description: "'Payday loans' are short-term unsecured loans with high interest rates.",
        type: goalBasis.once
      },
      {
        name: "Organize my credit records",
        description: "Organizing my credit records will allow me to find documents easily, handle disputes, and potentially save money.",
        type: goalBasis.once
      },
      {
        name: "Apply for secured credit card account(s)",
        description: "Secured credit card account(s) are cards that are credit cards backed by a cash deposit made when I created the account.",
        type: goalBasis.once
      },
      {
        name: "Do 30 minutes in trusted online financial literacy course",
        description: "Learning to become financially literate will help me with current responsibilities and help me make better financial decisions in the future.",
        type: goalBasis.daily
      },
      {
        name: "Save enough to pay $10 more than minimum payment on credit card each month",
        description: "It is important to save enough to pay my credit card monthly without issue.",
        type: goalBasis.monthly
      },
      {
        name: "Pay student loans on time",
        description: "Paying students loans late will often cause additional fees.",
        type: goalBasis.monthly
      },
      {
        name: "Check for credit report errors",
        description: "It is important to know if I have credit report errors so I can make the necessary changes.",
        type: goalBasis.monthly
      },
    ],
  },

  /* Start of Education Milestones*/

  {
    id: "high school",
    category: categories.education,
    subcategory: educationSubcategories.level,
    name: "High school diploma",
    sortOrder: 1,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=44", name: "High School or GED" },
    ],
    measures: {
      type: measureData.dropdown,
      startLabel: "What is your current level of education?",
      endLabel: "What level do you want to acquire?",
      startOptions: optionLists.educationLevelsHighSchool,
      // endOptions can be omitted because start and end options are the same
      defaultStart: "Some high school completed",
      defaultEnd: "High school diploma",
    },
    goals: [
      {
        name: "Talk with guidance counselor at school",
        description: "A guidance counselor can give me insight on the requirements to receive a high school diploma and give general academic advice.",
        type: goalBasis.once
      },
      {
        name: "Set up a quiet place in my home to study and do homework",
        description: "Establishing a quiet place in my home to study and do homework will allow me to become more effective.",
        type: goalBasis.once
      },
      {
        name: "Find a study group",
        description: "A study group can motivate me to learn content and are a resource when having confusion.",
        type: goalBasis.once
      },
      {
        name: "Make a plan for doing daily homework",
        description: "A plan for doing daily homework will make it more likely that I will find the time to complete my homework.",
        type: goalBasis.once
      },
      {
        name: "Make a plan for doing longer projects",
        description: "A plan for doing longer projects will make it more likely I will complete the project on time and also will reduce stress.",
        type: goalBasis.once
      },
      {
        name: "Explore ways to learn STEM",
        description: "Learning STEM (Science,Tech,Engin,Math) can help me learn information and skills useful in a future career.",
        type: goalBasis.once
      },
      {
        name: "Complete homework assignments",
        description: "Completing homework assignments on time can improve learning retention and reduce future stress.",
        type: goalBasis.daily,
      },
      {
        name: "Review homework requirements",
        description: "Reviewing homework requirements can help me plan on strategies to sufficiently complete the homework.",
        type: goalBasis.daily,
      },
      {
        name: "Practice using computer",
        description: "The ability to use a computer proficiently has education, social, and general life benefits.",
        type: goalBasis.daily,
      },
      {
        name: "Read for fun for 30 minutes",
        description: "Reading for fun reduces stress, is a mental exercise, and grows my vocabulary.",
        type: goalBasis.daily,
      },
      {
        name: "Go the the school library to do homework",
        description: "Going to the school library to do homework is a designated study spot free from distractions.",
        type: goalBasis.daily,
      },
      {
        name: "Make flashcards for test",
        description: "Flashcards can help me test myself fon key terms and ideas.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=49", name: "Different Study Strategies" },
        ],
        type: goalBasis.weekly,
      },
      {
        name: "Attend after-school tutoring with my teacher",
        description: "After-school tutoring with my teacher can clarify specific questions and deepen my understanding of the material.",
        type: goalBasis.weekly,
      },
      {
        name: "Do study session with friend",
        description: "Studying with a friend can increase learning retention and increase motivation.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=49", name: "Different Study Strategies" },
        ],
        type: goalBasis.weekly
      },
    ],
  },
  {
    id: "GED",
    category: categories.education,
    subcategory: educationSubcategories.level,
    name: "GED",
    sortOrder: 2,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=44", name: "High School or GED" },
    ],
    measures: {
      type: measureData.dropdown,
      startLabel: "What is your current level of education?",
      endLabel: "What level do you want to acquire?",
      startOptions: optionLists.educationLevelsGED,
      // endOptions can be omitted because start and end options are the same
      defaultStart: "Some high school completed",
      defaultEnd: "GED",
    },
    goals: [
      {
        name: "Research requirements for GED",
        description: "To earn a GED, I must make sure I fulfill all the requirements.",
        links: [
          { url: "https://demo.ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=44", name: "List of requirements to take GED." },
        ],
        type: goalBasis.once
      },
      {
        name: "Find online prep course",
        description: "A prep course is an effective way to study for an exam on my own time.",
        type: goalBasis.once
      },
      {
        name: "Order study materials online",
        description: "Study materials are an effective way to study for an exam on my own time.",
        type: goalBasis.once
      },
      {
        name: "Make a plan for studying for GED",
        description: "Having a plan for studying for the GED will make me more effective when studying.",
        type: goalBasis.once
      },
      {
        name: "Take a practice GED exam",
        description: "A practice GED exam is an effective way to learn the test structure and practice for the actual exam.",
        type: goalBasis.once
      },
      {
        name: "Review completed practice exam",
        description: "A completed practice exam can help me review test structure and mistakes.",
        type: goalBasis.once
      },
      {
        name: "Check exam locations",
        description: "The GED is only offered at certain locations and on certain days in person. It is also available on-line with certain requirements for the setting in which I would be taking the exam.",
        type: goalBasis.once
      },
      {
        name: "Register for the GED exam",
        description: "I will need to register for the GED exam, for a particular date and location where the exam is being offered or online.",
        type: goalBasis.once
      },
      {
        name: "Prepare proper identification for exam",
        description: "It is important to have the proper identification for the exam so I can take it without delay.",
        type: goalBasis.once
      },
      {
        name: "Checkout a GED prep book from the library",
        description: "A GED prep book is an effective way to study for an exam on my own time.",
        type: goalBasis.once
      },
      {
        name: "Set a budget for prep course and the test",
        description: "Preparing for an exam can be expensive, making it important to have a budget for the prep course and test.",
        type: goalBasis.once
      },
      {
        name: "Study for GED exam for 1 hour",
        type: goalBasis.daily
      },
      {
        name: "Practice using computer",
        description: "The ability to use a computer proficiently has education, social, and general life benefits.",
        type: goalBasis.daily
      },
      {
        name: "Read for fun for 30 minutes",
        description: "Reading for fun reduces stress, is a mental exercise, and grows my vocabulary.",
        type: goalBasis.daily
      },
      {
        name: "Do study session with friend",
        description: "Studying with a friend can increase learning retention and increase motivation.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=49", name: "Different Study Strategies" },
        ],
        type: goalBasis.weekly
      },
      {
        name: "Make flashcards for test",
        description: "Flashcards can help me test myself fon key terms and ideas.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=49", name: "Different Study Strategies" },
        ],
        type: goalBasis.weekly,
      },
    ],
  },

  {
    id: "associate's degree",
    category: categories.education,
    subcategory: educationSubcategories.level,
    name: "Associate's degree",
    sortOrder: 3,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=50", name: "Community College/College/University" },
    ],
    measures: {
      type: measureData.dropdown,
      startLabel: "What is your current level of education?",
      endLabel: "What level do you want to acquire?",
      startOptions: optionLists.educationLevelsAssociates,
      // endOptions can be omitted because start and end options are the same
      defaultStart: "Some high school completed",
      defaultEnd: "Associate's degree",
    },
    goals: [
      {
        name: "Talk with guidance counselor at school about applying to community college",
        description: "A guidance counselor at school can guide me through the application process when applying to community college.",
        type: goalBasis.once
      },
      {
        name: "Research community colleges",
        description: "Community colleges are two-year institutions that can prepare me for careers or more school.",
        links: [
          { url: "https://demo.ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=50", name: "List of requirements to apply for community college." },
        ],
        type: goalBasis.once
      },
      {
        name: "Apply for community colleges",
        description: "Community colleges are two-year institutions that can prepare me for careers or more school.",
        links: [
          { url: "https://demo.ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=50", name: "List of requirements to apply for community college." },
        ],
        type: goalBasis.once
      },
      {
        name: "Apply for financial aid and scholarships",
        description: "Financial aid and scholarships can give me economic support when paying for community college.",
        type: goalBasis.once
      },
      {
        name: "Enroll at community college",
        description: "Community colleges are two-year institutions that can prepare me for careers or more school.",
        type: goalBasis.once
      },
      {
        name: "Track degree progress and credit requirements",
        description: "It is important to know my degree progress and credit requirements to graduate on time.",
        type: goalBasis.once
      },
      {
        name: "Talk with course advisor at community college",
        description: "Course advisors can give me advice and guidance when selecting courses.",
        type: goalBasis.once
      },
      {
        name: "Find a study group",
        description: "A study group can motivate me to learn content and are a resource when having confusion.",
        type: goalBasis.once
      },
      {
        name: "Order study materials online",
        description: "Study materials are helpful when studying for courses and preparation.",
        type: goalBasis.once
      },
      {
        name: "Create flashcards",
        description: "Flashcards are an effective method for studying and memorization.",
        type: goalBasis.once
      },
      {
        name: "Check ways to learn STEM (Science, Tech, Engin, Math) in community college",
        description: "Learning STEM (Science,Tech,Engin,Math) can help me learn information and skills useful in a future career.",
        type: goalBasis.once
      },
      {
        name: "Make a plan for doing daily homework",
        description: "A plan for doing daily homework will make it more likely that I will find the time to complete my homework.",
        type: goalBasis.once
      },
      {
        name: "Make a plan for doing longer projects",
        description: "A plan for doing longer projects will make it more likely I will complete the project on time and also will reduce stress.",
        type: goalBasis.once
      },
      {
        name: "Ask teacher or mentor for recommendation letter",
        description: "When applying for jobs or different schools I may need a recommendation letter from a teacher or mentor.",
        type: goalBasis.once
      },
      {
        name: "Research fields and programs",
        description: "Different fields and programs can help me develop skills and find a future career.",
        type: goalBasis.once
      },
      {
        name: "Request copies of GED/high school transcript",
        description: "To apply for community college I will often need to show a GED/high school transcript.",
        type: goalBasis.once
      },
      {
        name: "Ask guidance counselor for application fee waivers",
        description: "A guidance counselor can support me when submitting applications with application fee waivers.",
        type: goalBasis.once
      },
      {
        name: "Work on application materials for community college",
        description: "Community colleges have different requirements and organizing them will allow me to apply.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=50", name: "Applying to Community College Info" }
        ],
        type: goalBasis.daily
      },
      {
        name: "Do homework",
        description: "Completing homework assignments on time can improve learning retention and reduce future stress.",
        type: goalBasis.daily
      },
      {
        name: "Work on application essay",
        description: "Many colleges require an application essay to receive an application.",
        type: goalBasis.daily
      },
      {
        name: "Do study session with friend",
        description: "Studying with a friend can increase learning retention and increase motivation.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=49", name: "Different Study Strategies" },
        ],
        type: goalBasis.weekly
      },
    ],
  },

  {
    id: "bachelor's degree",
    category: categories.education,
    subcategory: educationSubcategories.level,
    name: "Bachelor's degree",
    sortOrder: 4,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=50", name: "Community College/College/University" },
    ],
    measures: {
      type: measureData.dropdown,
      startLabel: "What is your current level of education?",
      endLabel: "What level do you want to acquire?",
      startOptions: optionLists.educationLevelsBachelors,
      // endOptions can be omitted because start and end options are the same
      defaultStart: "High school diploma",
      defaultEnd: "Bachelor's degree",
    },
    goals: [
      {
        name: "Talk with guidance counselor at school about applying to college/university",
        description: "A guidance counselor at school can guide me through the application process when applying to college/university.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-57&redirect_to=subentity&gotopage[1137]=1", name: "College Admissions" },
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-55&redirect_to=subentity&gotopage[1137]=1", name: "College Prep" },
        ],
        type: goalBasis.once
      },
      {
        name: "Research colleges/universities",
        description: "A college/university is an educational institution for a specialized field or profession.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-57&redirect_to=subentity&gotopage[1137]=1", name: "College Admissions" },
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-55&redirect_to=subentity&gotopage[1137]=1", name: "College Prep" },
        ],
        type: goalBasis.once
      },
      {
        name: "Research colleges/universities (including children-friendly ones)",
        description: "Colleges/university can have different environments (children-friendly ones), distance, costs, and strengths.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-57&redirect_to=subentity&gotopage[1137]=1", name: "College Admissions" },
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-55&redirect_to=subentity&gotopage[1137]=1", name: "College Prep" },
        ],
        type: goalBasis.once
      },
      {
        name: "Apply for colleges/universities",
        description: "A college/university is an educational institution for a specialized field or profession.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-57&redirect_to=subentity&gotopage[1137]=1", name: "College Admissions" },
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-55&redirect_to=subentity&gotopage[1137]=1", name: "College Prep" },
        ],
        type: goalBasis.once
      },
      {
        name: "Apply for financial aid and scholarships",
        description: "Financial aid and scholarships can give me economic support when paying for college.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-57&redirect_to=subentity&gotopage[1137]=1", name: "College Admissions" },
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-55&redirect_to=subentity&gotopage[1137]=1", name: "College Prep" },
        ],
        type: goalBasis.once
      },
      {
        name: "Enroll at college/university",
        description: "A college/university is an educational institution for a specialized field or profession.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-57&redirect_to=subentity&gotopage[1137]=1", name: "College Admissions" },
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-55&redirect_to=subentity&gotopage[1137]=1", name: "College Prep" },
        ],
        type: goalBasis.once
      },
      {
        name: "Track degree progress and credit requirements",
        description: "It is important to know my degree progress and credit requirements to graduate on time.",
        type: goalBasis.once
      },
      {
        name: "Talk with academic advisor at college/university",
        description: "An academic advisor at college/university can give me advice and guidance when selecting courses.",
        type: goalBasis.once
      },
      {
        name: "Make a plan for doing daily homework",
        description: "A plan for doing daily homework will make it more likely that I will find the time to complete my homework.",
        type: goalBasis.once
      },
      {
        name: "Make a plan for doing longer projects",
        description: "A plan for doing longer projects will make it more likely I will complete the project on time and also will reduce stress.",
        type: goalBasis.once
      },
      {
        name: "Find a study group",
        description: "A study group can motivate me to learn content and are a resource when having confusion.",
        type: goalBasis.once
      },
      {
        name: "Order study materials online",
        description: "Study materials are helpful when studying for courses and preparation.",
        type: goalBasis.once
      },
      {
        name: "Apply for internships",
        description: "An internship is work experience offered by an organization for a period of time. It often is unpaid. ",
        type: goalBasis.once
      },
      {
        name: "Go to tutoring sessions",
        description: "Tutoring sessions can clarify confusion and help me review material.",
        type: goalBasis.once
      },
      {
        name: "Check ways to learn STEM (Science, Tech, Engin, Math) in college/univ",
        description: "Learning STEM (Science,Tech,Engin,Math) can help me learn information and skills useful in a future career.",
        type: goalBasis.once
      },
      {
        name: "Work on application materials for college/university",
        description: "Colleges/Universities have different requirements and organizing them will allow me to apply.",
        type: goalBasis.daily
      },
      {
        name: "Do homework",
        description: "Completing homework assignments on time can improve learning retention and reduce future stress.",
        type: goalBasis.daily
      },
      {
        name: "Study for SAT",
        description: "Studying over a structured period of time improves long-term memory.",
        type: goalBasis.daily
      },
      {
        name: "Study for ACT",
        description: "Studying over a structured period of time improves long-term memory.",
        type: goalBasis.daily
      },
      {
        name: "Do study session with friend",
        description: "Studying with a friend can increase learning retention and increase motivation.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=49", name: "Different Study Strategies" },
        ],
        type: goalBasis.weekly
      },
      {
        name: "Research internships",
        description: "An internship is a opportunity to learn skills and find a career.",
        type: goalBasis.weekly
      },
      {
        name: "Work on application essays",
        description: "Many colleges require an application essay to receive an application.",
        type: goalBasis.weekly
      },
      {
        name: "Ask guidance counselor to review and edit application essay",
        type: goalBasis.weekly
      },
      {
        name: "Work on scholarship application materials/apply for scholarships",
        type: goalBasis.weekly
      },
      {
        name: "Make flashcards for test",
        description: "Flashcards can help me test myself fon key terms and ideas.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=49", name: "Different Study Strategies" },
        ],
        type: goalBasis.weekly,
      },
    ],
  },

  {
    id: "military",
    category: categories.education,
    subcategory: educationSubcategories.level,
    name: "Military with related training",
    sortOrder: 5,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=45", name: "Military (Active Duty or Reserves)" },
    ],
    measures: {
      type: measureData.dropdown,
      startLabel: "What is your current level of education?",
      endLabel: "What level do you want to acquire?",
      startOptions: optionLists.educationLevelsMilitary,
      // endOptions can be omitted because start and end options are the same
      defaultStart: "High school diploma",
      defaultEnd: "Military with related training",
    },
    goals: [
      {
        name: "Talk with guidance counselor at school about military",
        description: "My guidance counselor can give me information and details about potentially joining the military.",
        type: goalBasis.once
      },
      {
        name: "Research programs in military",
        description: "The milirary has many programs including educational support and college assistance programs.",
        type: goalBasis.once
      },
      {
        name: "Apply for military",
        description: "Military applications can be very selective and many requirements are needed.",
        type: goalBasis.once
      },
      {
        name: "Check ways to learn STEM (Science, Tech, Engin, Math) in military",
        description: "Learning STEM (Science,Tech,Engin,Math) can help me learn information and skills useful in a future career.",
        type: goalBasis.once
      },
      {
        name: "Research commitments before enlisting",
        description: "The military is a big commitment and often requires a commitment to four years of active duty.",
        type: goalBasis.once
      },
      {
        name: "Enlist in military active-duty",
        description: "If I am in military active-duty, I am required to work for the military full time and I can be deployed at any time.",
        type: goalBasis.once
      },
      {
        name: "Enlist in military reserves",
        description: "The military reserves requires me to serve the military part time while being close to home.",
        type: goalBasis.once
      },
      {
        name: "Know schedule for first three months after enlisting",
        description: "It is important for me to know my schedule for first three months after enlisting to plan ahead and prepare.",
        type: goalBasis.once
      },
      {
        name: "Think about elements involved with military active-duty and reserves",
        description: "It is important to know requirements and commitments of being involved with military active-duty and reserves.",
        links: [
          { url: "https://demo.ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=45", name: "Military commitments" },
        ],
        type: goalBasis.daily
      },
      {
        name: "Talk with family and friends about military",
        description: "Family and friends can give advice and potentially experience about military.",
        type: goalBasis.daily
      },
      {
        name: "Work on application materials for military",
        description: "Military applications can be very selective and many requirements are needed.",
        links: [
          { url: "https://demo.ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=45", name: "Applying to military college" },
        ],
        type: goalBasis.daily
      },
    ],
  },

  {
    id: "training",
    category: categories.education,
    subcategory: educationSubcategories.level,
    name: "Trade/technical/vocational training",
    sortOrder: 6,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=46", name: "Trade School/Professional License" },
    ],
    measures: {
      type: measureData.dropdown,
      startLabel: "What is your current level of education?",
      endLabel: "What level do you want to acquire?",
      startOptions: optionLists.educationLevelsTraining,
      // endOptions can be omitted because start and end options are the same
      defaultStart: "High school diploma",
      defaultEnd: "Trade/technical/vocational training",
    },
    goals: [
      {
        name: "Talk with guidance counselor at school about trade/technical/vocational training",
        description: "A guidance counseslor can give me information and guide me through the application process for trade/technical/vocational training.",
        type: goalBasis.once
      },
      {
        name: "Study for trade school entrance exam",
        description: "Many trade/technical/vocational schools have entrance exams to enter the school and it is important that I study for them.",
        type: goalBasis.once
      },
      {
        name: "Apply for financial aid and scholarships",
        description: "Financial aid and scholarships can give me economic support when paying for trade/technical/vocational training.",
        type: goalBasis.once
      },
      {
        name: "Apply for apprenticeships",
        description: "Apprenticeships includes basic training and on the job training where I would accompany an expert of the trade or profession.",
        type: goalBasis.once
      },
      {
        name: "Join a study group",
        description: "A study group can motivate me to learn content and can be a resource when having confusion.",
        type: goalBasis.once
      },
      {
        name: "Check ways to learn STEM (Science, Tech, Engin, Math) in trade/technical/vocational training",
        description: "Learning STEM (Science,Tech,Engin,Math) can help me learn information and skills useful in a future career.",
        type: goalBasis.once
      },
      {
        name: "Make a plan for doing daily homework",
        description: "A plan for doing daily homework will make it more likely that I will find the time to complete my homework.",
        type: goalBasis.once
      },
      {
        name: "Make a plan for doing longer projects",
        description: "A plan for doing longer projects will make it more likely I will complete the project on time and also will reduce stress.",
        type: goalBasis.once
      },
      {
        name: "Research vocational schools in the area",
        description: "Vocational schools provide technical skills for a particular task or job.",
        type: goalBasis.once
      },
      {
        name: "Research childcare options",
        description: "It is important I know the childcare options if I am going to make the time commitment to trade/technical/vocational training.",
        type: goalBasis.once
      },
      {
        name: "Work on application materials for trade/technical/vocational training",
        description: "Trade/technical/vocational training have different requirements and organizing them will allow me to apply.",
        links: [
          { url: "https://demo.ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=46", name: "Steps to apply for trade school." },
        ],
        type: goalBasis.daily
      },
      {
        name: "Do homework",
        description: "Completing homework assignments on time can improve learning retention and reduce future stress.",
        type: goalBasis.daily
      },
      {
        name: "Practice technical skills",
        description: "Working on technical skills will allow me to build skills useful for a future career.",
        type: goalBasis.daily
      },
      {
        name: "Do study session with friend",
        description: "Studying with a friend can increase learning retention and increase motivation.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=49", name: "Different Study Strategies" },
        ],
        type: goalBasis.weekly
      },
    ],
  },

  {
    id: "postgraduate",
    category: categories.education,
    subcategory: educationSubcategories.level,
    name: "Postgraduate title",
    sortOrder: 7,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=185", name: "Postgraduate title" },
    ],
    measures: {
      type: measureData.dropdown,
      startLabel: "What is your current level of education?",
      endLabel: "What level do you want to acquire?",
      startOptions: optionLists.educationLevelsPostgraduate,
      // endOptions can be omitted because start and end options are the same
      defaultStart: "Bachelor's degree",
      defaultEnd: "Postgraduate title",
    },
    goals: [
      {
        name: "Talk with academic advisor at school about applying to graduate programs",
        description: "An academic advisor can give me information and guide me through the application process for graduate programs.",
        type: goalBasis.once
      },
      {
        name: "Research graduate programs",
        description: "Different graduate programs have different requirements and opportunities like being children-friendly.",
        type: goalBasis.once
      },
      {
        name: "Take the GRE/other entrance exam(s)",
        description: "I will need to register for the GRE/other entrance exam(s), for a particular date and location where the exam is being offered or online. ",
        type: goalBasis.once
      },
      {
        name: "Ask for references",
        description: "I will need references to apply to some postgraduate programs to recommend me as a qualified student.",
        type: goalBasis.once
      },
      {
        name: "Apply for colleges/universities",
        description: "Many colleges/universities offer courses of study and advanced academic degrees for those who have earned an undergraduate degree.",
        type: goalBasis.once
      },
      {
        name: "Apply for financial aid and scholarships",
        description: "Financial aid and scholarships can give me economic support when paying for graduate programs.",
        type: goalBasis.once
      },
      {
        name: "Enroll at college/university",
        description: "Many colleges/universities offer courses of study and advanced academic degrees for those who have earned an undergraduate degree.",
        type: goalBasis.once
      },
      {
        name: "Track degree progress and credit requirements",
        description: "It is important to know my degree progress and credit requirements to graduate on time.",
        type: goalBasis.once
      },
      {
        name: "Talk with academic advisor in grad program",
        description: "An academic advisor in a grad program can can give me advice and guidance when selecting courses.",
        type: goalBasis.once
      },
      {
        name: "Find a study group",
        description: "A study group can motivate me to learn content and are a resource when having confusion.",
        type: goalBasis.once
      },
      {
        name: "Make a plan for doing daily homework",
        description: "A plan for doing daily homework will make it more likely that I will find the time to complete my homework.",
        type: goalBasis.once
      },
      {
        name: "Make a plan for doing longer projects",
        description: "A plan for doing longer projects will make it more likely I will complete the project on time and also will reduce stress.",
        type: goalBasis.once
      },
      {
        name: "Work on application materials for graduate program",
        description: "Graduate programs can be very selective and many requirements are needed.",
        type: goalBasis.daily
      },
      {
        name: "Do homework",
        description: "Completing homework assignments on time can improve learning retention and reduce future stress.",
        type: goalBasis.daily
      },
      {
        name: "Do study session with friend",
        description: "Studying with a friend can increase learning retention and increase motivation.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=49", name: "Different Study Strategies" },
        ],
        type: goalBasis.weekly
      },
      {
        name: "Make flashcards for test",
        description: "Flashcards can help me test myself fon key terms and ideas.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=49", name: "Different Study Strategies" },
        ],
        type: goalBasis.weekly,
      },
    ],
  },

  {
    id: "close to home",
    category: categories.education,
    subcategory: educationSubcategories.location,
    name: "Close to home",
    sortOrder: 1,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=184", name: "Location" },
    ],
    measures: {
      type: measureData.none,
    },
    goals: [
      {
        name: "Talk with guidance counselor at school",
        description: "A guidance counselor can give me academic and general advice for my education level.",
        type: goalBasis.once
      },
      {
        name: "Check locations of courses before enrolling",
        description: "It is important for me to know the location of courses and distance from my home.",
        type: goalBasis.once
      },
      {
        name: "Get a MetroCard, bus pass, transit pass, etc",
        description: "A MetroCard, bus pass, transit pass, etc can help me get from home to where my classes are.",
        type: goalBasis.once
      },
      {
        name: "Search online for degree programs nearby",
        description: "A degree program nearby can allow me to earn my degree from a place close to my home and reduce stress.",
        type: goalBasis.once
      },
    ],
  },

  {
    id: "close to school",
    category: categories.education,
    subcategory: educationSubcategories.location,
    name: "Close to child/ren's school/s",
    sortOrder: 2,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=184", name: "Location" },
    ],
    measures: {
      type: measureData.none,
    },
    goals: [
      {
        name: "Talk with guidance counselor at school",
        description: "A guidance counselor can give me insight on the requirements to receive a high school diploma and give general academic advice.",
        type: goalBasis.once
      },
      {
        name: "Check locations of courses before enrolling",
        description: "It is important for me to know the location of courses and distance from my child/ren's school/s.",
        type: goalBasis.once
      },
      {
        name: "Get a MetroCard, bus pass, transit pass, etc",
        description: "A MetroCard, bus pass, transit pass, etc can help me get from my child/ren's school/s to where my classes are.",
        type: goalBasis.once
      },
      {
        name: "Search online for degree programs nearby",
        description: "A degree program nearby can allow me to earn my degree from a place close to my home and reduce stress.",
        type: goalBasis.once
      },
    ],
  },

  {
    id: "commute education",
    category: categories.education,
    subcategory: educationSubcategories.location,
    name: "Easy commute",
    sortOrder: 3,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=184", name: "Location" },
    ],
    measures: {
      type: measureData.none,
    },
    goals: [
      {
        name: "Talk with guidance counselor at school",
        description: "A guidance counselor can give me insight on the requirements to receive a high school diploma and give general academic advice.",
        type: goalBasis.once
      },
      {
        name: "Check locations of courses before enrolling",
        description: "It is important for me to know the location of courses and distance from my home.",
        type: goalBasis.once
      },
      {
        name: "Get a MetroCard, bus pass, transit pass, etc",
        description: "A MetroCard, bus pass, transit pass, etc can help me get from home to where my classes are.",
        type: goalBasis.once
      },
      {
        name: "Search online for degree programs nearby",
        description: "A degree program nearby can allow me to earn my degree from a place close to my home and reduce stress.",
        type: goalBasis.once
      },
    ],
  },

  {
    id: "virtual learning",
    category: categories.education,
    subcategory: educationSubcategories.location,
    name: 'Virtual learning that is not "self-paced"',
    sortOrder: 4,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=184", name: "Location" },
    ],
    measures: {
      type: measureData.none,
    },
    goals: [
      {
        name: "Schedule meeting with academic advisor to learn about online options at current school",
        description: "An academic advisor can give me iformation and details about the online options at my current schol.",
        type: goalBasis.once
      },
      {
        name: "Search for online degree programs",
        description: "An online degree program can allow me to earn my degree from home.",
        type: goalBasis.once
      },
      {
        name: "Compare different virtual learning options",
        description: "A virtual learning option can allow me to earn my degree from home.",
        type: goalBasis.once
      },
      {
        name: "Practice using computer",
        description: "The ability to use a computer proficiently has education, social, and general life benefits.",
        type: goalBasis.daily
      },
      {
        name: "Use online scheduling tool (such as Google calendar) to plan courseload",
        description: "An online scheduling tool can reduce stress and manage courseload with other responsibilities.",
        type: goalBasis.daily
      },
    ],
  },

  {
    id: "schedule time",
    category: categories.education,
    subcategory: educationSubcategories.schedule,
    name: "Classes scheduled during time of day/night I want",
    sortOrder: 1,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=183", name: "Schedule" },
    ],
    measures: {
      type: measureData.none,
    },
    goals: [
      {
        name: "Schedule meeting with academic advisor",
        description: "An academic advisor can give me advice and guidance about how to structure my course schedule.",
        type: goalBasis.once
      },
      {
        name: "Use online scheduling tool (such as Google calendar) to plan courseload",
        description: "An online scheduling tool can reduce stress and manage courseload with other responsibilities.",
        type: goalBasis.daily
      },
    ],
  },

  {
    id: "schedule pacing",
    category: categories.education,
    subcategory: educationSubcategories.schedule,
    name: "Online courses I can do at my own pace",
    sortOrder: 2,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=183", name: "Schedule" },
    ],
    measures: {
      type: measureData.none,
    },
    goals: [
      {
        name: "Schedule meeting with academic advisor to learn about online options at current school",
        description: "An academic advisor can give me iformation and details about the online options at my current schol.",
        type: goalBasis.once
      },
      {
        name: 'Research online "self-paced" courses in my field at various schools',
        description: "An online \"self-paced\" course in my field at various schools would allow me to woark at my own pace from home.",
        type: goalBasis.once
      },
      {
        name: "Set up a space at home for studying",
        description: "Setting a space at home for studying will allow me to have a quiet location to study efficiently.",
        type: goalBasis.once
      },
      {
        name: "Practice using computer",
        description: "The ability to use a computer proficiently has education, social, and general life benefits.",
        type: goalBasis.daily
      },
      {
        name: "Use online scheduling tool (such as Google calendar) to plan courseload",
        description: "An online scheduling tool can reduce stress and manage courseload with other responsibilities.",
        type: goalBasis.daily
      },
    ],
  },

  {
    id: "workload somewhat",
    category: categories.education,
    subcategory: educationSubcategories.satisfaction,
    name: "Workload somewhat manageable",
    sortOrder: 1,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=48", name: "Increasing Enjoyment in School" },
    ],
    measures: {
      type: measureData.dropdown,
      startLabel: "How managable is your current workload?",
      endLabel: "How managable do you want your workload to be?",
      startOptions: optionLists.educationEnjoymentSomewhat,
      // endOptions can be omitted because start and end options are the same
      defaultStart: "Workload not manageable",
      defaultEnd: "Workload somewhat manageable",
    },
    goals: [
      {
        name: "Talk with guidance counselor at school",
        description: "A guidance counselor can give me academic and general advice for my education level.",
        type: goalBasis.once
      },
      {
        name: "Discuss time management ideas with family and friends",
        description: "My friends and family can give me advice on how to balance my time with school and my other responsibilities.",
        type: goalBasis.once
      },
      {
        name: "Use online scheduling tool (such as Google calendar) to manage workload",
        type: goalBasis.weekly
      },
      {
        name: "Do study session with friend",
        description: "Studying with a friend can increase learning retention and increase motivation.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=49", name: "Different Study Strategies" },
        ],
        type: goalBasis.weekly
      },
    ],
  },

  {
    id: "workload fully",
    category: categories.education,
    subcategory: educationSubcategories.satisfaction,
    name: "Workload fully manageable",
    sortOrder: 2,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=48", name: "Increasing Enjoyment in School" },
      { url: "ourreach/index.php?module=ext/ipages/view&id=49", name: "Enjoying School & Study Skills" },
    ],
    measures: {
      type: measureData.dropdown,
      startLabel: "How managable is your current workload?",
      endLabel: "How managable do you want your workload to be?",
      startOptions: optionLists.educationEnjoymentFully,
      // endOptions can be omitted because start and end options are the same
      defaultStart: "Workload not manageable",
      defaultEnd: "Workload fully manageable",
    },
    goals: [
      {
        name: "Talk with guidance counselor at school",
        description: "A guidance counselor can give me academic and general advice for my education level.",
        type: goalBasis.once
      },
      {
        name: "Discuss time management ideas with family and friends",
        description: "My friends and family can give me advice on how to balance my time with school and my other responsibilities.",
        type: goalBasis.once
      },
      {
        name: "Use online scheduling tool (such as Google calendar) to manage workload",
        type: goalBasis.weekly
      },
      {
        name: "Do study session with friend",
        description: "Studying with a friend can increase learning retention and increase motivation.",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=ext/ipages/view&id=49", name: "Different Study Strategies" },
        ],
        type: goalBasis.weekly
      },
    ],
  },

  {
    id: "healthy balance",
    category: categories.education,
    subcategory: educationSubcategories.satisfaction,
    name: "Healthy school-rest-of-life balance",
    sortOrder: 3,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=49", name: "Enjoying School & Study Skills" },
    ],
    measures: {
      type: measureData.none,
    },
    goals: [
      {
        name: "Talk with guidance counselor at school",
        description: "A guidance counselor can give me academic and general advice for my education level.",
        type: goalBasis.once
      },
      {
        name: "Discuss school-rest-of-life-balance with family and friends",
        description: "My friends and family can give me advice on how to balance my time with school and my other responsibilities.",
        type: goalBasis.once
      },
      {
        name: "Ask friend or family to babysit once a week so I can study",
        description: "Asking my friend or family to babysit once a week so I can study would allow me a period of time to focus on my course material.",
        type: goalBasis.once
      },
      {
        name: "Walk/Exercise for 30 minutes today",
        description: "Exercising is essential for the human body. Walking for 30 minutes a day can prevent serious health issues.",
        type: goalBasis.daily,
        frequency: 1,
        times: [12 * 60 * 60],
      },
      {
        name: "Study when baby is napping",
        description: "Studying when the baby is napping is an opportunity to review materials without distractions.",
        type: goalBasis.daily
      },
      {
        name: "Use online scheduling tool (such as Google calendar) to manage workload",
        type: goalBasis.weekly
      },
      {
        name: "Spend some time with friends",
        description: "Spending times with friends can reduce stress and improve relationships.",
        type: goalBasis.weekly
      },
    ],
  },

  {
    id: "like going",
    category: categories.education,
    subcategory: educationSubcategories.satisfaction,
    name: "I like going to class",
    sortOrder: 4,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=48", name: "Increasing Enjoyment in School" },
    ],
    measures: {
      type: measureData.none,
    },
    goals: [
      {
        name: "Talk with guidance counselor at school",
        description: "A guidance counselor can give me academic and general advice for my education level.",
        type: goalBasis.once
      },
      {
        name: "Reflect on the class: talk to a friend, fellow students, or a family member",
        description: "Reflecting on a class with someone can help me review material and improve understanding.",
        type: goalBasis.daily
      },
      {
        name: "Write in my gratitude journal",
        description: "Writing in a Gratitude Journal improves positivity, self-esteem, reduces stress, and helps me sleep better.",
        type: goalBasis.daily
      },
    ],
  },

  {
    id: "challenging",
    category: categories.education,
    subcategory: educationSubcategories.satisfaction,
    name: "It challenges me to grow",
    sortOrder: 5,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=49", name: "Enjoying School & Study Skills" },
    ],
    measures: {
      type: measureData.none,
    },
    goals: [
      {
        name: "Talk with guidance counselor or academic advisor",
        description: "A guidance counselor can give me academic and general advice for my education level.",
        type: goalBasis.once
      },
      {
        name: "Reflect on the class: talk to a friend, fellow students, or a family member",
        description: "Reflecting on a class with someone can help me review material and improve understanding.",
        type: goalBasis.daily
      },
      {
        name: "Write in my gratitude journal",
        description: "Writing in a Gratitude Journal improves positivity, self-esteem, reduces stress, and helps me sleep better.",
        type: goalBasis.daily
      },
    ],
  },

  {
    id: "interesting",
    category: categories.education,
    subcategory: educationSubcategories.satisfaction,
    name: "Class topics genuinely interest me",
    sortOrder: 6,
    links: [
      { url: "ourreach/index.php?module=ext/ipages/view&id=48", name: "Increasing Enjoyment in School" },
    ],
    measures: {
      type: measureData.none,
    },
    goals: [
      {
        name: "Talk with guidance counselor or academic advisor",
        description: "A guidance counselor can give me academic and general advice for my education level.",
        type: goalBasis.once
      },
      {
        name: "Look up course descriptions",
        description: "Asking my friend or family to babysit once a week so I can study would allow me a period of time to focus on my course material.",
        type: goalBasis.once
      },
      {
        name: "Ask previous students about the material, professors, interests, etc",
        description: "Previous students can give me more information and detail about material, professors, interests, etc.",
        type: goalBasis.once
      },
      {
        name: "Reflect on the class: talk to a friend, fellow students, or a family member",
        description: "Reflecting on a class with someone can help me review material and improve understanding.",
        type: goalBasis.daily
      },
      {
        name: "Write in my gratitude journal",
        description: "Writing in a Gratitude Journal improves positivity, self-esteem, reduces stress, and helps me sleep better.",
        type: goalBasis.daily
      },
    ],
  },

  /* Start of Other Milestones*/

  {
    id: "younglives camp",
    category: categories.other,
    subcategory: otherSubcategories.program,
    name: "Prepare for YoungLives Camp",
    sortOrder: 1,
    links: [
      { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-40&redirect_to=subentity&gotopage[875]=1", name: "YoungLives Camp Forms" },
    ],
    measures: {
      type: measureData.none,
    },
    goals: [
      {
        name: "Review Camp Calendar",
        description: "Review Camp Calendar to Prepare for Camp",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35&action=download_attachment&preview=1&file=MTYyNzMxNjY4OV9Zb3VuZ0xpdmVzX1VQREFURURfQ2FsZW5kYXJfdG9fUHJlcGFyZV9mb3JfQ2FtcF8yNUp1bjIwMjEucGRm", name: "Camp Calendar" },
        ],
        type: goalBasis.once
      },
      {
        name: "Review Camp Health Form (for myself)",
        description: "Review Camp Health Form (for myself) to learn if my doctor needs to complete any part, in addition to providing immunization records",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-40&action=download_attachment&preview=1&file=MTYyMDIxODY5NV9Zb3VuZ0xpdmVzX0NhbXBfSGVhbHRoX0Zvcm1fdG9fQ29tcGxldGVfZm9yX2VhY2hfQ2FtcGVyX2FuZF9lYWNoX0NoaWxkXzIwMjEucGRm", name: "Camp Health Forms" },
        ],
        type: goalBasis.once
      },
      {
        name: "Arrange Pick-up for my Immunization Records",
        description: "If I only need immunization records from my doctor, call doctor's office to arrange pick-up",
        type: goalBasis.once
      },
      {
        name: "Drop off my Health Form",
        description: "If I need my doctor to complete part of form in addition to immunization records, drop off form at doctor's office",
        type: goalBasis.once
      },
      {
        name: "Pick Up my Immunization Records and Possibly Form",
        description: "Pick up immunization records (and other part of form, if necessary) from doctor's office",
        type: goalBasis.once
      },
      {
        name: "Submit my Camp Health Form",
        description: "Submit to YoungLives my completed Camp Health Form with immunization records",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-40&action=download_attachment&preview=1&file=MTYyMDIxODY5NV9Zb3VuZ0xpdmVzX0NhbXBfSGVhbHRoX0Zvcm1fdG9fQ29tcGxldGVfZm9yX2VhY2hfQ2FtcGVyX2FuZF9lYWNoX0NoaWxkXzIwMjEucGRm", name: "Camp Health Forms" },
        ],
        type: goalBasis.once
      },
      {
        name: "Review Camp Health Form (for my child/ren)",
        description: "Review Camp Health Form (for my child/ren) to learn if pediatrician needs to complete any part, in addition to providing immunization records",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-40&action=download_attachment&preview=1&file=MTYyMDIxODY5NV9Zb3VuZ0xpdmVzX0NhbXBfSGVhbHRoX0Zvcm1fdG9fQ29tcGxldGVfZm9yX2VhY2hfQ2FtcGVyX2FuZF9lYWNoX0NoaWxkXzIwMjEucGRm", name: "YL Camp Child Information" },
        ],
        type: goalBasis.once
      },
      {
        name: "Arrange Pick-up for Immunization Records for my child/ren",
        description: "If I only need immunization records for my child/ren from my pediatrician, call pediatrician's office to arrange pick-up",
        type: goalBasis.once
      },
      {
        name: "Drop off my child/ren's Health Form(s)",
        description: "If I need pediatrician to complete part of form in addition to immunization records, drop off form at pediatricians's office",
        type: goalBasis.once
      },
      {
        name: "Pick Up my child/ren's Immunization Records and Possibly Form(s)",
        description: "Pick up immunization records (and other part of form, if necessary) from pediatrician's office, for each child",
        type: goalBasis.once
      },
      {
        name: "Submit Camp Health Form for my child/ren",
        description: "Submit to YoungLives the completed Camp Health Form for each child, with immunization records",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-40&action=download_attachment&preview=1&file=MTYyMDIxODY5NV9Zb3VuZ0xpdmVzX0NhbXBfSGVhbHRoX0Zvcm1fdG9fQ29tcGxldGVfZm9yX2VhY2hfQ2FtcGVyX2FuZF9lYWNoX0NoaWxkXzIwMjEucGRm", name: "YL Camp Health Form" },
        ],
        type: goalBasis.once
      },
      {
        name: "Submit Child Information Sheet",
        description: "Submit to YoungLives the completed Child Information Sheet for each child",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-40&action=download_attachment&preview=1&file=MTYyMDIxODY4NV9DaGlsZF9JbmZvcm1hdGlvbl9TaGVldF9mb3JfWW91bmdMaXZlc19DYW1wLnBkZg%3D%3D", name: "YL Camp Child Sheet" },
        ],
        type: goalBasis.once
      },
      {
        name: "Submit Camper Contract",
        description: "Submit to YoungLives my completed Camper Contract",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-40&action=download_attachment&preview=1&file=MTYyMDIxOTA1MF9Zb3VuZ0xpdmVzX0NhbXBlcl9Db250cmFjdC5wZGY%3D", name: "Camper Contract" },
        ],
        type: goalBasis.once
      },
      {
        name: "Review Camp Packing List",
        description: "Review the Camp Packing List to make sure I have everything needed",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-40&action=download_attachment&preview=1&file=MTYyMDIyODc2MV9Zb3VuZ0xpdmVzX0NhbXBlcl9QYWNraW5nX0xpc3QucGRm", name: "Packing List" },
        ],
        type: goalBasis.once
      },
      {
        name: "Get anything else needed from the Packing List",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-40&action=download_attachment&preview=1&file=MTYyMDIyODc2MV9Zb3VuZ0xpdmVzX0NhbXBlcl9QYWNraW5nX0xpc3QucGRm", name: "Packing List" },
        ],
        type: goalBasis.once
      },
      {
        name: "Pack",
        links: [
          { url: "ourreachld.com/ourreach/index.php?module=items/info&path=35-40&action=download_attachment&preview=1&file=MTYyMDIyODc2MV9Zb3VuZ0xpdmVzX0NhbXBlcl9QYWNraW5nX0xpc3QucGRm", name: "Packing List" },
        ],
        type: goalBasis.once
      },
      {
        name: "Leave for Camp",
        type: goalBasis.once
      },
    ],
  },

  {
    id: "younglives ongoing",
    category: categories.other,
    subcategory: otherSubcategories.program,
    name: "YoungLives Ongoing Activities",
    sortOrder: 2,
    measures: {
      type: measureData.none,
    },
    goals: [
      {
        name: "Call at least one YoungLives friend",
        description: "It is suggested to call one YoungLives friend (try to contact various friends at different times) weekly (or more) at my own convenience.",
        type: goalBasis.weekly,
      },
      {
        name: "Text my YoungLives mentor",
        description: "It is suggested to text my YoungLives leader or mentor weekly (or more) at my own convenience. Another way to communicate with my mentor is through the 'Messages' Chat feature in this app.",
        type: goalBasis.weekly,
      },

      {
        name: "Attend YoungLives event",
        description: "It is suggested to attend a YoungLives event (meeting or other event) twice per month (or more) at my own convenience.",
        type: goalBasis.monthly,
        days: [14, 28]
      },
    ],
  },
];

export { templateData, educationSubcategories, healthSubcategories, housingSubcategories, jobsSubcategories, moneySubcategories, childrenSubcategories, otherSubcategories }