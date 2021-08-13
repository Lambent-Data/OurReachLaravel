import { templateData, educationSubcategories, healthSubcategories, housingSubcategories, jobsSubcategories, moneySubcategories, childrenSubcategories, otherSubcategories } from "../milestone-template-data";
import { CategoryEnum } from "./enums";

const Subcategory = {};

Subcategory[CategoryEnum.HEALTH] = healthSubcategories;
Subcategory[CategoryEnum.HOUSING] = housingSubcategories;
Subcategory[CategoryEnum.MONEY] = moneySubcategories;
Subcategory[CategoryEnum.JOBS] = jobsSubcategories;
Subcategory[CategoryEnum.EDUCATION] = educationSubcategories;
Subcategory[CategoryEnum.CHILDREN] = childrenSubcategories;
Subcategory[CategoryEnum.OTHER] = otherSubcategories;

const TemplateMilestone = {}
const TemplateMilestoneById = {}
for (const cat in CategoryEnum){
  TemplateMilestone[CategoryEnum[cat]] = {};
  for (const subcat of Object.values(Subcategory[CategoryEnum[cat]])){
    TemplateMilestone[CategoryEnum[cat]][subcat.id] = [];
  }
}

for (const ms of templateData){
  TemplateMilestone[ms.category][ms.subcategory.id][ms.id] = ms;
  TemplateMilestoneById[ms.id] = ms;
}


console.log(TemplateMilestone);

export { Subcategory, TemplateMilestone, TemplateMilestoneById }