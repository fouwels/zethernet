# SPDX-FileCopyrightText: 2020 Kaelan Thijs Fouwels <kaelan.thijs@fouwels.com>
#
# SPDX-License-Identifier: MIT

include(ZeekPlugin)

include_directories(BEFORE ${CMAKE_CURRENT_SOURCE_DIR} ${CMAKE_CURRENT_BINARY_DIR})

zeek_plugin_begin(Zeek ENIPLG)
	zeek_plugin_cc(ENIPLG.cc Plugin.cc)
	zeek_plugin_bif(events.bif)
	zeek_plugin_pac(eniplg.pac eniplg-analyzer.pac eniplg-protocol.pac)
zeek_plugin_end()
