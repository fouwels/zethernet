# Generated by binpac_quickstart

refine flow ENIPLG_Flow += {
	function enip_list_identity(list_identity: List_Identity): bool 
	%{
		printf("[EVENT: LIST_IDENTITY] Vendor %#02x Product %s\n", ${list_identity.vendor}, std_str(${list_identity.product_name}).c_str());

	 	//BifEvent::generate_eniplg_identity(connection()->bro_analyzer(), connection()->bro_analyzer()->Conn(), ${list_identity.vendor}, ${list_identity.product_name});

		return true;
	%}	

	function enip_other(other: Other): bool 
	%{
		printf("[EVENT: GENERIC]\n");

		//BifEvent::generate_eniplg_command(connection()->bro_analyzer(), connection()->bro_analyzer()->Conn(), ${enip_header.command});

		return true;
	%}	
};

