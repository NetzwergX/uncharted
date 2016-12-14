package com.bpodgursky.uncharted.datasets;

import java.util.Set;

public class StarRecord extends ObjectRecord{

  private final StarIdentifiers identifiers;

  private final Double lightYearDistance;
  private final Double rightAscensionRadians;
  private final Double declinationRadians;
  private final Double absoluteMagnitude;
  private final String rawStellarClassification;
  private final StellarClassification parsedStellarClassification;
  private final Coordinate cartesianCoordsInLys;

  private final Double temperatureEstimate;

  private Set<Integer> nearbyObjectIDs;

  public StarRecord(StarIdentifiers identifiers,
                    ExternalLinks links,
                    Double lightYearDistance,
                    Double rightAscensionRadians,
                    Double declinationRadians,
                    Double absoluteMagnitude,
                    String stellarClass,
                    Double colorIndex,
                    Double luminosity) {
    super(identifiers.getPrimaryName(), "STAR");
    this.identifiers = identifiers;
    this.lightYearDistance = lightYearDistance;
    this.rightAscensionRadians = rightAscensionRadians;
    this.declinationRadians = declinationRadians;
    this.absoluteMagnitude = absoluteMagnitude;
    this.rawStellarClassification = stellarClass;
    this.parsedStellarClassification = StarClassHelper.parseClass(stellarClass);
    this.cartesianCoordsInLys = AstroConvert.equatorialToCartesian(rightAscensionRadians, declinationRadians, lightYearDistance);

    if (colorIndex == null) {
      this.temperatureEstimate = StarClassHelper.getTemperatureEstimate(parsedStellarClassification);
    } else {
      this.temperatureEstimate = AstroConvert.bvToTemperature(colorIndex);
    }

    setLinks(links);
    setRadiusInLys(AstroConvert.getRadiusLys(luminosity, temperatureEstimate));
  }

  public void setNearbyObjectIDs(Set<Integer> nearbyObjectIDs){
    this.nearbyObjectIDs = nearbyObjectIDs;
  }

  public StarIdentifiers getIdentifiers() {
    return identifiers;
  }

  public Double getLightYearDistance() {
    return lightYearDistance;
  }

  public Double getRightAscensionRadians() {
    return rightAscensionRadians;
  }

  public Double getDeclinationRadians() {
    return declinationRadians;
  }

  public Double getAbsoluteMagnitude() {
    return absoluteMagnitude;
  }

  public Coordinate getCartesianCoordsInLys() {
    return cartesianCoordsInLys;
  }

  public String getRawStellarClassification() {
    return rawStellarClassification;
  }

  public StellarClassification getParsedStellarClassification() {
    return parsedStellarClassification;
  }

  public Double getTemperatureEstimate() {
    return temperatureEstimate;
  }
}
