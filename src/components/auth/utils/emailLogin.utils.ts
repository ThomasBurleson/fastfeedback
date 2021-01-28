import { FormikValues } from 'formik';

export interface EmailLoginFormValues {
  email?: string;
  password?: string;
  rememberMe?: boolean;
}

export const regexEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
export const FORM_STYLES = {
  INPUT_FIELD:
    'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
  REMEMBER_ME: 'h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded',
  SUBMIT_BTN:
    'mt-12 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
};

export const isValidEmail = (values: FormikValues, key = 'email'): boolean => {
  return regexEmail.test(values[key] || '');
};
