/**
 * 
 */
package cn.sdc.viz.birdflu;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Writer;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.io.HierarchicalStreamWriter;
import com.thoughtworks.xstream.io.json.JsonHierarchicalStreamDriver;
import com.thoughtworks.xstream.io.json.JsonWriter;

/**
 * @author duyi
 *
 */
public class DataParser {

	/**
	 * 解析数据，返回JSONArray
	 * @return
	 */
	public JSONArray parseAllData(){
		JSONArray array = new JSONArray();
		parseOldH7N9(array);
		parseNewData(array);
		return array;
	}
	/**
	 * 解析自己搜集的数据
	 */
	private void parseNewData(JSONArray resultArray){
    	XStream xstream = new XStream(new JsonHierarchicalStreamDriver() {
    	    public HierarchicalStreamWriter createWriter(Writer writer) {
    	        return new JsonWriter(writer, JsonWriter.DROP_ROOT_MODE);
    	    }
    	});
    	
    	InputStream is = null;
    	BufferedReader br = null;
    	DateFormat format = new SimpleDateFormat("yyyy/MM/dd");
    	
    	JSONArray array = new JSONArray();
    	JSONObject obj;
		try {
			is = DataParser.class.getResourceAsStream("/禽流感数据_下半年.csv");
			br = new BufferedReader(new InputStreamReader(is));
			
			String s = br.readLine();
			s = br.readLine();
			while(s != null){
				Patient p = new Patient();
				String[] tokens = s.split("\\,", 22);
				String token = tokens[0];
				p.setNumber(Integer.parseInt(token));
				token = tokens[1];
				if(token.trim().equals("H7N9"))
					p.setType(Patient.H7N9);
				else if(token.trim().equals("H10N8"))
					p.setType(Patient.H10N8);
				else {
					p.setType(Patient.H5N1);
				}
				token = tokens[2];
				p.setName(token);
				token = tokens[3];
				p.setAge(token.isEmpty() ? 0 : Integer.parseInt(token));
				token = tokens[4];
				if(token.isEmpty())
					p.setSex(Patient.SEX_UNKNOWN);
				else if(token.trim().equals("男"))
					p.setSex(Patient.SEX_MALE);
				else
					p.setSex(Patient.SEX_FEMALE);
				//职业
				token = tokens[5];			
				p.setOccupation(parseOccup(token));
//				p.setOccupation(token);
				//发病位置
				token = tokens[6];
				p.setProvince(token);
				token = tokens[7];
				p.setCity(token);
				token = tokens[8];
				p.setCounty(token);
				token = tokens[10];
				p.setDetailLocation(token);
				token = tokens[11];
				p.setLongitude(Double.parseDouble(token));
				obj = new JSONObject();
				obj.put("lat", Double.parseDouble(token));
				token = tokens[12];
				p.setLatitude(Double.parseDouble(token));
				obj.put("lng", Double.parseDouble(token));
				obj.put("count", 1);
				array.put(obj);
				//时间
				token = tokens[13];
				if(token.isEmpty())
					p.setDate(new Date());
				else
					p.setDate(format.parse(token));
				//医院
				token = tokens[14];
				p.setHospital(token);
				
				token = tokens[16];
				if(token.isEmpty())
					p.setNumContact(-1);
				else
					p.setNumContact(Integer.parseInt(token));
				
				token = tokens[17];
				String temp = tokens[19];
				if(temp.contains("治愈")){
					p.setStatus(Patient.STATUS_GOOD);
				}else if(temp.contains("死亡")){
					p.setStatus(Patient.STATUS_DEAD);
				}else{
				if(temp.contains("死亡") || token.contains("死亡")){
					p.setStatus(Patient.STATUS_DEAD);
				}else if(temp.contains("危重") || token.contains("危重") || token.contains("未脱离生命危险")){
					p.setStatus(Patient.STATUS_VERYHEAVY);
				}else if(temp.contains("严重") || token.contains("严重")){
					p.setStatus(Patient.STATUS_HEAVY);
				}else if(temp.contains("平稳") || token.contains("平稳") || token.contains("症状较轻")
				|| token.contains("平稳") || token.contains("稳定")){
					p.setStatus(Patient.STATUS_LIGHT);
				}else if(temp.isEmpty() && token.isEmpty()){
					p.setStatus(Patient.STATUS_UNKNOWN);					
				}else{
					p.setStatus(Patient.STATUS_GOOD);
				}
				}
				
				token = tokens[20];
				p.setDesc(token);
				//来源
				token = tokens[21];
				p.setSourceLink(token.substring(0, token.indexOf(',')));		
				s = br.readLine();
				
				JSONObject tempObj = new JSONObject(xstream.toXML(p));
				resultArray.put(tempObj);
			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} catch (ParseException e) {
			e.printStackTrace();
		} catch (NumberFormatException e) {
			e.printStackTrace();
		} catch (JSONException e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 解析之前的H7N9数据
	 * from xiaoru team
	 * @return
	 */
	private void parseOldH7N9(JSONArray resultArray){
    	XStream xstream = new XStream(new JsonHierarchicalStreamDriver() {
    	    public HierarchicalStreamWriter createWriter(Writer writer) {
    	        return new JsonWriter(writer, JsonWriter.DROP_ROOT_MODE);
    	    }
    	});
    	
    	InputStream is = null;
    	BufferedReader br = null;
    	DateFormat format = new SimpleDateFormat("yyyy/MM/dd");
    	try{
			is = DataParser.class.getResourceAsStream("/H7N9.txt");
			br = new BufferedReader(new InputStreamReader(is));
			
			String s = br.readLine();
			StringBuffer sb = new StringBuffer();
			while(s != null){
				sb.append(s);
				s = br.readLine();
			}
			
			JSONArray array = new JSONArray(sb.toString().trim());
			String temp;
			String provTemp; 
			String job;
			for(int i = 0; i < array.length(); i ++){
				JSONObject o = array.getJSONObject(i);
				
				Patient p = new Patient();
				p.setName(o.getString("Name"));
				provTemp = o.getString("Province");
				
				p.setProvince(parseProv(provTemp));//o.getString("Province"));
				p.setCity(o.getString("City"));
				if(o.getString("Gender").trim().equals("男"))
					p.setSex(Patient.SEX_MALE);
				else
					p.setSex(Patient.SEX_FEMALE);
				temp = o.getString("Age").trim();
				if(temp.isEmpty() || temp.equals("/"))
					p.setAge(-1);
				else
					p.setAge(Integer.parseInt(temp));
				
				p.setDesc(o.getString("Description"));
				job = o.getString("Title");
				p.setOccupation(parseOccup(job));
				temp = o.getString("CurrentState").trim();
				if(temp.equals("死亡"))
					p.setStatus(Patient.STATUS_DEAD);
				else if(temp.equals("病危"))
					p.setStatus(Patient.STATUS_VERYHEAVY);
				else if(temp.equals("确诊"))
					p.setStatus(Patient.STATUS_LIGHT);
				else
					p.setStatus(Patient.STATUS_GOOD);
				p.setDate(format.parse(o.getString("Time")));
				p.setLatitude(Double.parseDouble(o.getString("Latitude").trim()));
				p.setLongitude(Double.parseDouble(o.getString("Longitude").trim()));
				p.setType(Patient.H7N9);
				
				JSONObject tempObj = new JSONObject(xstream.toXML(p));
				resultArray.put(tempObj);
			}
    	}catch(Exception e){
    		e.printStackTrace();
    	}
	}
	
	private String parseOccup(String oc){
		if(oc.equalsIgnoreCase("无") || oc.equalsIgnoreCase("无业") ||
				oc.equalsIgnoreCase("待业"))
			return "无业";
		if(oc.isEmpty() || oc.contains("/"))
			return "不详";
		if(oc.contains("学生"))
			return "学生";
		if(oc.contains("儿童"))
			return "儿童";
		if(oc.contains("退休")|| oc.contains("离休"))
			return "离退休";
		if(oc.contains("活禽") || oc.contains("禽类") || oc.contains("宰杀") ||
				oc.contains("肉鸽") || oc.contains("家禽") || oc.contains("鸡鸭"))
			return "禽类相关行业";
		if(oc.contains("猪肉"))
			return "畜类相关行业";
		if(oc.contains("职工") ||oc.contains("职员") || oc.contains("工人"))
			return "职工";
		if(oc.contains("务农") ||oc.trim().equals("农民"))
			return "农民";
		if(oc.contains("材料加工") ||oc.contains("板材加工") ||oc.contains("搬运工作") || oc.contains("商业服务人员"))
			return "农民";
		return oc;
	}
	private String parseProv(String provTemp) {
		if(provTemp.startsWith("山东")){
			return "山东省";
		}		
		if(provTemp.startsWith("河北")){
			return "河北省";
		}
		if(provTemp.startsWith("山西")){
			return "山西省";
		}
		if(provTemp.startsWith("辽宁")){
			return "辽宁省";
		}
		if(provTemp.startsWith("吉林")){
			return "吉林省";
		}
		if(provTemp.startsWith("黑龙江")){
			return "黑龙江省";
		}
		if(provTemp.startsWith("江苏")){
			return "江苏省";
		}
		if(provTemp.startsWith("浙江")){
			return "浙江省";
		}
		if(provTemp.startsWith("安徽")){
			return "安徽省";
		}
		if(provTemp.startsWith("福建")){
			return "福建省";
		}		
		if(provTemp.startsWith("江西")){
			return "江西省";
		}
		if(provTemp.startsWith("河南")){
			return "河南省";
		}
		if(provTemp.startsWith("湖北")){
			return "湖北省";
		}
		if(provTemp.startsWith("湖南")){
			return "湖南省";
		}
		if(provTemp.startsWith("广东")){
			return "广东省";
		}
		if(provTemp.startsWith("海南")){
			return "海南省";
		}
		if(provTemp.startsWith("贵州")){
			return "贵州省";
		}
		if(provTemp.startsWith("云南")){
			return "云南省";
		}
		if(provTemp.startsWith("陕西")){
			return "陕西省";
		}
		if(provTemp.startsWith("甘肃")){
			return "甘肃省";
		}
		if(provTemp.startsWith("青海")){
			return "青海省";
		}
		if(provTemp.startsWith("台湾")){
			return "台湾省";
		}
		if(provTemp.startsWith("内蒙古")){
			return "内蒙古自治区";
		}
		if(provTemp.startsWith("广西")){
			return "广西壮族自治区";
		}
		if(provTemp.startsWith("西藏")){
			return "西藏自治区";
		}
		if(provTemp.startsWith("宁夏")){
			return "宁夏回族自治区";
		}
		if(provTemp.startsWith("新疆")){
			return "新疆维吾尔自治区";
		}
		if(provTemp.startsWith("香港")){
			return "香港特别行政区";
		}
		if(provTemp.startsWith("澳门")){
			return "澳门特别行政区";
		}
		if(provTemp.startsWith("北京")){
			return "北京市";
		}
		
		return provTemp;
	}
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		new DataParser().parseOldH7N9(new JSONArray());
	}

}
