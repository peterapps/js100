
start		call	mouse_read	mouse_ra
		cp	0x80000004	mouse_x
		cp	0x80000003	mouse_y
		be	start		0		0


// E100 mouse driver

mouse_read	bne	mouse_read	0x80000071	num0
		cp	0x80000070	num1
mouse_read2	bne	mouse_read2	0x80000071	num1
		add	mouse_x		mouse_x		0x80000072
		add	mouse_y		mouse_y		0x80000073
		cp	0x80000070	num0
		ret	mouse_ra

mouse_x	320
mouse_y	240
mouse_ra	0
num0	0
num1	1
