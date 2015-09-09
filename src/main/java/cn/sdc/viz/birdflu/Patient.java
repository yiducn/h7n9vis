/**
 * 
 */
package cn.sdc.viz.birdflu;

import java.util.Date;

/**
 * @author duyi
 *
 */
public class Patient {

	public static final int H7N9 	= 1;
	public static final int H5N1 	= 2;
	public static final int H10N8	= 3;
	
	public static final int SEX_MALE	=	1;
	public static final int SEX_FEMALE	=	2;
	public static final int SEX_UNKNOWN	=	3;
	
	public static final int STATUS_DEAD			=	1;
	public static final int STATUS_VERYHEAVY	=	2;
	public static final int STATUS_HEAVY		=	3;
	public static final int STATUS_LIGHT		=	4;
	public static final int STATUS_GOOD			=	5;
	public static final int STATUS_UNKNOWN 		= 	6;
	
	private	int		number;
	private	int		type;
	private	String	name;
	private	int		age;
	private	int		sex;
	private	String	occupation;
	private String	province;
	private	String	city;
	private	String	county;
	private	String	detailLocation;
	private	double	longitude;
	private	double	latitude;
	private	Date	date;
	private	String	hospital;
	private	int		numContact;
	private	int		status;
	private	String	desc;
	private	String	sourceLink;
	private long		dateValue;
	
	/**
	 * 
	 */
	public Patient() {
		// TODO Auto-generated constructor stub
	}

	public int getNumber() {
		return number;
	}

	public void setNumber(int number) {
		this.number = number;
	}

	public int getType() {
		return type;
	}

	/**
	 * Patient.H7N9
	 * @param type
	 */
	public void setType(int type) {
		this.type = type;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		this.age = age;
	}

	public int getSex() {
		return sex;
	}

	/**
	 * {@code Patient.SEX_MALE...}
	 * @param sex
	 */
	public void setSex(int sex) {
		this.sex = sex;
	}

	public String getOccupation() {
		return occupation;
	}

	public void setOccupation(String occupation) {
		this.occupation = occupation;
	}

	public String getProvince() {
		return province;
	}

	public void setProvince(String province) {
		this.province = province;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getCounty() {
		return county;
	}

	public void setCounty(String county) {
		this.county = county;
	}

	public String getDetailLocation() {
		return detailLocation;
	}

	public void setDetailLocation(String detailLocation) {
		this.detailLocation = detailLocation;
	}

	public double getLongitude() {
		return longitude;
	}

	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}

	public double getLatitude() {
		return latitude;
	}

	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
		dateValue = date.getTime();
	}

	public String getHospital() {
		return hospital;
	}

	public void setHospital(String hospital) {
		this.hospital = hospital;
	}

	public int getNumContact() {
		return numContact;
	}

	public void setNumContact(int numContact) {
		this.numContact = numContact;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	public String getSourceLink() {
		return sourceLink;
	}

	public void setSourceLink(String sourceLink) {
		this.sourceLink = sourceLink;
	}
	
	

}
