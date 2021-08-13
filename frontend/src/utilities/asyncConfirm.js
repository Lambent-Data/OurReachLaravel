import ConfirmComponent from '../classes/components/ConfirmComponent.js';

async function asyncConfirm(message, callback){
  new ConfirmComponent(message, callback);
}

export { asyncConfirm }