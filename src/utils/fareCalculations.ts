
export interface FareBreakdown {
  baseFare: number;
  extraKm: number;
  extraKmCharge: number;
  dayDriverAllowance: number;
  nightCharge: number;
  totalDayDriverAllowance: number;
  totalNightCharge: number;
  gst: number;
  total: number;
}

export interface VehicleRate {
  id: string;
  pickup_city_id: string;
  destination_city_id: string;
  vehicle_id: string;
  total_running_km: number;
  daily_km_limit: number;
  per_km_charges: number;
  extra_per_km_charge: number;
  day_driver_allowance: number;
  night_charge: number;
  base_fare: number;
  is_active: boolean;
}

export const calculateDaysAndNights = (pickupDate: string | null, returnDate: string | null) => {
  if (!pickupDate || !returnDate) {
    return { numberOfDays: 1, numberOfNights: 1 };
  }

  const pickup = new Date(pickupDate);
  const returnD = new Date(returnDate);
  
  // Calendar-wise calculation: pickup date is day 1, return date is last day
  // Calculate total days by finding difference + 1 (inclusive of both dates)
  const timeDifference = returnD.getTime() - pickup.getTime();
  const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
  const numberOfDays = daysDifference + 1; // +1 to include both pickup and return dates
  
  // For nights calculation, we consider the stay period
  // If it's same day pickup and return, it's still 1 night
  const numberOfNights = daysDifference >= 1 ? daysDifference : 1;
  
  return { 
    numberOfDays: numberOfDays >= 1 ? numberOfDays : 1, 
    numberOfNights 
  };
};

export const calculateFareBreakdown = (rate: VehicleRate, numberOfDays: number, numberOfNights: number): FareBreakdown => {
  // Base fare = daily km limit * no of days * per km charges
  const baseFare = (rate.daily_km_limit || 0) * numberOfDays * (rate.per_km_charges || 0);
  
  // Calculate extra km if total running km exceeds daily limit for the trip
  const totalAllowedKm = (rate.daily_km_limit || 0) * numberOfDays;
  const extraKm = Math.max(0, (rate.total_running_km || 0) - totalAllowedKm);
  const extraKmCharge = extraKm * (rate.extra_per_km_charge || 0);
  
  // Total day driver allowance = no of days * day driver allowance
  const totalDayDriverAllowance = numberOfDays * (rate.day_driver_allowance || 0);
  
  // Total night charge = no of nights * night charge
  const totalNightCharge = numberOfNights * (rate.night_charge || 0);
  
  // Calculate subtotal (sum of all components except GST)
  const subtotal = baseFare + extraKmCharge + totalDayDriverAllowance + totalNightCharge;
  
  // GST = 5% of overall amount
  const gst = subtotal * 0.05;
  
  // Estimated trip fare = sum of all components including GST
  const total = subtotal + gst;
  
  return {
    baseFare,
    extraKm,
    extraKmCharge,
    dayDriverAllowance: rate.day_driver_allowance || 0,
    nightCharge: rate.night_charge || 0,
    totalDayDriverAllowance,
    totalNightCharge,
    gst,
    total
  };
};
