import stateManagementGeneratorForEntity from "../Services/stateManaementGeneratorForEntity";

export const parkingLotEvents = stateManagementGeneratorForEntity({
  post: 'addEvent.json',
  get: 'getLocationEvents.json',
  delete: 'removeEvent.json',

}, 'parkingLotEvents');

export const enforcement = stateManagementGeneratorForEntity({
  post: 'addEnforcement.json',
  update: 'updateEnforcement.json',
  addExistingEnforcement: 'addExistingEnforcement.json',
  get: 'getEnforcements.json',
}, 'enforcements');

export const parkingLotLevels = stateManagementGeneratorForEntity({
  delete: 'removeLevel.json',
}, 'parkingLotLevels');

export const parkingLotSurgeEvents = stateManagementGeneratorForEntity({
  delete: 'removeSurgeEvent.json',
}, 'parkingLotSurgeEvents');

export const parkingLotPromotions = stateManagementGeneratorForEntity({
  delete: 'removePromotion.json',
}, 'parkingLotPromotions');

export const parkingLotAdministrators = stateManagementGeneratorForEntity({
  get: 'lotAdminList.json',
  delete: 'deleteLotAdmin.json',
  update: 'updateLotAdminDetails.json',
  invitation: 'lotAdminInvitation.json',
  add: 'addParkingLotAdmin.json',
}, 'parkingLotAdministrators');

export const parkingLotStateManagement = stateManagementGeneratorForEntity({
  delete: 'removeParkingLot.json',
  get: 'allParkingList.json',
  getList: 'parkingList.json',
  monthly: 'monthlyParkingList.json',
  previousParkingLots: 'previousLocations.json',
}, 'parkingLot')

export const permitStateManagementEntity = stateManagementGeneratorForEntity({
  activePermit: 'activeDailyHourlyPermits.json',
  reservePermit: 'reserveParkingByAdmin.json',
  upcomingVisitors: 'upcomingVisitorsPermits.json',
  get: 'permitList.json',
  update: 'updatePermitDetails.json'
}, 'permits')

export const residentUserManagement = stateManagementGeneratorForEntity({
  register: 'signup.json',
  resetPassword: 'resetPassword.json',
  updatePassword: 'updatePassword.json',
  getVehicle: 'userVehicleList.json',
  updateVehicle: 'updateUserVehicle.json',
}, 'residentUser')

export const paymentMethodManagement = stateManagementGeneratorForEntity({
  get: 'getUserPaymentMethods.json',
  add: 'addPaymentMethod.json',
  update: 'updatePaymentMethod.json',
  default: 'signup.json',
  processMonthlyPayment: 'processUserMonthlyPayment.json',
}, 'paymentMethod')



export const messagingManagement = stateManagementGeneratorForEntity({
  markAsRead: 'markMessagesAsRead.json',
}, 'messaging')



