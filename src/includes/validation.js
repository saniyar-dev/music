import {
  Form as VeeForm, Field as VeeField, defineRule, ErrorMessage, configure,
} from 'vee-validate';
import {
  required, min, max, alpha_spaces as alphaSpaces, email,
  min_value as minValue, max_value as maxValue,
  confirmed, not_one_of as exluded,
} from '@vee-validate/rules';

export default {
  install(app) {
    app.component('VeeForm', VeeForm);
    app.component('VeeField', VeeField);
    app.component('ErrorMessage', ErrorMessage);

    defineRule('required', required);
    defineRule('tos', required);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('alpha_spaces', alphaSpaces);
    defineRule('email', email);
    defineRule('min_value', minValue);
    defineRule('max_value', maxValue);
    defineRule('confirmed', confirmed);
    defineRule('exluded', exluded);
    defineRule('not_supported_country', exluded);

    configure({
      generateMessage: (ctx) => {
        const messgaes = {
          required: `The field ${ctx.field} is required`,
          max: `The field ${ctx.field} is too long`,
          min: `The field ${ctx.field} is too short`,
          alpha_spaces: `The field ${ctx.field} cannot contain non alphabetic character`,
          email: 'You should provide a valid email',
          min_value: `The value of field ${ctx.field} is too low`,
          max_value: `The value of field ${ctx.field} is too high`,
          confirmed: 'You should enter the same You entered in password field',
          exluded: "There is something wrong with option you've choosed",
          not_supported_country: 'Due to restrictions, we cannot provide service to this country',
          tos: 'You must accept the Terms of Service',
        };

        const message = messgaes[ctx.rule.name] ? messgaes[ctx.rule.name] : `The field ${ctx.field} is not valid`;

        return message;
      },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false,
      validateOnModelUpdate: true,
    });
  },
};
