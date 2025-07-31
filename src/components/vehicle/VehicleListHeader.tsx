
interface DistanceInfo {
  distance: number;
  warning?: string;
  error?: string;
}

interface VehicleListHeaderProps {
  tripType: string;
  pickupCity: string;
  destinationCity: string;
  pickupDate: string | null;
  returnDate: string | null;
  packageId: string;
  airportName: string;
  numberOfDays?: number;
  numberOfNights?: number;
  distanceInfo?: DistanceInfo | null;
}

export const VehicleListHeader = ({
  tripType,
  pickupCity,
  destinationCity,
  pickupDate,
  returnDate,
  packageId,
  airportName,
  numberOfDays,
  numberOfNights,
  distanceInfo
}: VehicleListHeaderProps) => {
  const getHeaderTitle = () => {
    switch (tripType) {
      case 'local':
        return `Local Trip in ${pickupCity}`;
      case 'airport':
        return `Airport Transfer - ${airportName}`;
      case 'oneway':
        return `One Way Trip: ${pickupCity} to ${destinationCity}`;
      case 'round':
      default:
        return `Round Trip: ${pickupCity} to ${destinationCity}`;
    }
  };

  const getSubtitle = () => {
    if (tripType === 'local') {
      return `Package: ${packageId} • ${pickupDate}`;
    }
    if (tripType === 'airport') {
      return `${pickupCity} • ${pickupDate}`;
    }
    return `${pickupDate} ${returnDate && `to ${returnDate}`}`;
  };

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">{getHeaderTitle()}</h1>
      <p className="text-muted-foreground">{getSubtitle()}</p>
    </div>
  );
};
