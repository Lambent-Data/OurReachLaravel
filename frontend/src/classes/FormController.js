export default class FormController {
  constructor(comp) {
    this.comp = comp;
    this.waiting = false;
  }

  get src() {
    return this.comp.src;
  }

  get parent() {
    return this.comp.parent;
  }

  async submit() {
    if (this.waiting) return;

    await this.doSubmission();

    this.waiting = false;
  }

  async doSubmission() {
    return;
  }

  async delete() {
    if (this.waiting) return;

    await this.doDeletion();

    this.waiting = false;
  }

  async doDeletion() {
    return;
  }
}
