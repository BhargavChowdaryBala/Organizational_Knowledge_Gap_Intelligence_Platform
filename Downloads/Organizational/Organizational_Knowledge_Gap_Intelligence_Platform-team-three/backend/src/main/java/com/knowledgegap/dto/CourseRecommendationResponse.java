package com.knowledgegap.dto;


public class CourseRecommendationResponse {


private String skillName;

private String courseName;

private String provider;

private String duration;

private String level;



public String getSkillName(){
return skillName;
}


public void setSkillName(String skillName){
this.skillName=skillName;
}



public String getCourseName(){
return courseName;
}


public void setCourseName(String courseName){
this.courseName=courseName;
}



public String getProvider(){
return provider;
}


public void setProvider(String provider){
this.provider=provider;
}



public String getDuration(){
return duration;
}


public void setDuration(String duration){
this.duration=duration;
}



public String getLevel(){
return level;
}


public void setLevel(String level){
this.level=level;
}


}