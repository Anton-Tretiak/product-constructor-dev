class ProductConstructor extends HTMLElement {
  constructor() {
    super();
    this.customSelects = [];
    this.nativeSelect = null;
  }

  connectedCallback() {
    this.customSelects = this.querySelectorAll('.product-constructor__select--custom');
    this.nativeSelect = document.querySelector('.select .select__select');

    this.customSelects.forEach(select => {
      select.addEventListener('change', this.updateNativeSelect.bind(this));
    });

    this.initializeCustomSelects();
  }

  buildParameterString() {
    const paramaterString = Array.from(this.customSelects).map(select => {
      const parameter = select.dataset.parameter;
      const value = select.value;
      return `${parameter}: ${value}`;
    }).join(' \\ ').trim().toLowerCase();

    return paramaterString;
  }

  updateNativeSelect() {
    const parameterString = this.buildParameterString();
    console.log('Parameter string: ', parameterString);
    const options = Array.from(this.nativeSelect.options);

    const matchingOption = options.find(option => {
      console.log('Option text: ', option.textContent.trim().toLowerCase());
      return option.textContent.trim().toLowerCase() === parameterString;
    });

    if (matchingOption) {
      console.log('Matching option found:', matchingOption);
      this.nativeSelect.value = matchingOption.value;

      const event = new Event('change', { bubbles: true });
      this.nativeSelect.dispatchEvent(event);
    } else {
      console.warn('No matching variant found for:', parameterString);
    }
  }

  initializeCustomSelects() {
    const currentVariant = this.nativeSelect.options[this.nativeSelect.selectedIndex].textContent.trim().toLowerCase();
    const parameterPairs = currentVariant.split(' \\ ');

    parameterPairs.forEach(pair => {
      const [parameter, value] = pair.split(': ').map(str => str.trim());
      const customSelect = Array.from(this.customSelects).find(select => select.dataset.parameter.toLowerCase() === parameter);

      if (customSelect) {
        customSelect.value = value;
      }
    });
  }
}

customElements.define('product-constructor', ProductConstructor);