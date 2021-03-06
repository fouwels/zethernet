// SPDX-FileCopyrightText: 2020 Kaelan Thijs Fouwels <kaelan.thijs@fouwels.com>
//
// SPDX-License-Identifier: MIT

#include "plugin/Plugin.h"

#include "ENIPLG.h"

namespace plugin {
namespace Zeek_ENIPLG {

class Plugin : public plugin::Plugin {
public:
	plugin::Configuration Configure()
		{
		AddComponent(new ::analyzer::Component("ENIPLG_TCP",  ::analyzer::eniplg::ENIPLG_TCP_Analyzer::InstantiateAnalyzer));
		AddComponent(new ::analyzer::Component("ENIPLG_UDP",  ::analyzer::eniplg::ENIPLG_UDP_Analyzer::InstantiateAnalyzer));

		plugin::Configuration config;
		config.name = "Zeek::ENIPLG";
		config.description = "eniplg analyzer";
		config.version.major = 0;
		config.version.minor = 1;
		config.version.patch = 0;
		return config;
		}
} plugin;

}
}