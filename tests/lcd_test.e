
start		cp	i	num0

loop		be	end	i	num16

		cp	lcd_x	i
		cp	lcd_y	num0
		add	lcd_ascii	i	charA
		call	lcd_write	lcd_ra

		cp	lcd_y	num1
		add	lcd_ascii	lcd_ascii	num16
		call	lcd_write	lcd_ra

		add	i	i	num1

		be	loop	0	0

end		halt
	


// E100 LCD driver

// Function: lcd_write
// Inputs: lcd_x, lcd_y, lcd_ascii

lcd_write	bne	lcd_write	0x80000011	num0
		cp	0x80000012	lcd_x
		cp	0x80000013	lcd_y
		cp	0x80000014	lcd_ascii
		cp	0x80000010	num1
lcd_write2	bne	lcd_write2	0x80000011	num1
		cp	0x80000010	num0
		ret	lcd_ra

lcd_x	0
lcd_y	0
lcd_ascii	0
lcd_ra	0

num0	0
num1	1
num16	16
i	0

charA	65
