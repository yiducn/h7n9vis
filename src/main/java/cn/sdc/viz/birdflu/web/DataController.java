package cn.sdc.viz.birdflu.web;

import org.json.JSONArray;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import cn.sdc.viz.birdflu.DataParser;

@Controller
public class DataController {

	@RequestMapping("birdflu/data.do")
	public @ResponseBody String data(){
		DataParser parser = new DataParser();
		return parser.parseAllData().toString();
	}
	
}
