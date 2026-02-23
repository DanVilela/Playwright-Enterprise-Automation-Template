/**
 * Test Fixtures - Static test data
 * 
 * Used to maintain consistent test data across test suites
 * No hardcoded values in spec files
 */

export const testUsers = {
  validUser: {
    username: 'standard_user',
    password: 'secret_sauce',
    displayName: 'Standard User',
  },
  lockedUser: {
    username: 'locked_out_user',
    password: 'secret_sauce',
    displayName: 'Locked Out User',
  },
  invalidUser: {
    username: 'invalid_user',
    password: 'wrong_password',
  },
};

export const testProducts = {
  backpackIndex: 0,
  bikeIndex: 1,
  shirtIndex: 2,
};

export const expectedMessages = {
  lockedOutError: 'Sorry, this user has been locked out.',
  invalidError: 'Username and password do not match any user in this service',
};

export const urls = {
  loginPage: '/',
  inventoryPage: '/inventory.html',
  cartPage: '/cart.html',
  checkoutPage: '/checkout-step-one.html',
};
