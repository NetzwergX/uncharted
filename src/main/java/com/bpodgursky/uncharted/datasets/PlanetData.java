package com.bpodgursky.uncharted.datasets;

import com.bpodgursky.uncharted.datasets.catalogs.ObjectValue;

public class PlanetData extends ObjectRecord{

  private final Integer planetId;
  private final int starId;
  private final PlanetName name;

  private final ObjectValue semiMajorAxisLys;
  private final ObjectValue eccentricity;
  private final ObjectValue orbitalPeriodDays;
  private final ObjectValue inclination;
  private final ObjectValue massKg;
  private final ObjectValue radiusLys;
  private final ObjectValue densityGcc;

  public static class PlanetName {

    private final String starName;
    private final String planetLetter;

    public PlanetName(String starName, String planetLetter) {
      this.starName = starName;
      this.planetLetter = planetLetter;
    }

    public String toString(){
      return starName+" "+planetLetter;
    }
  }

  public PlanetData(Integer planetId,
                    int starID,
                    PlanetName name,
                    ObjectValue semiMajorAxisLys,
                    ObjectValue eccentricity,
                    ObjectValue orbitalPeriodDays,
                    ObjectValue inclination,
                    ObjectValue massKg,
                    ObjectValue radiusLys,
                    ObjectValue densityGcc){
    super(name.toString(), "PLANET");

    this.planetId = planetId;
    this.starId = starID;
    this.name = name;

    this.semiMajorAxisLys = semiMajorAxisLys;
    this.eccentricity = eccentricity;
    this.orbitalPeriodDays = orbitalPeriodDays;
    this.inclination = inclination;
    this.massKg = massKg;
    this.radiusLys = radiusLys;
    this.densityGcc = densityGcc;

    setRadius(radiusLys);
  }

}
