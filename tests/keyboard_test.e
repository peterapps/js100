
start		call	key_read	key_ra
		cp	print_data	key_pressed
		call	print_dec	print_ra
		call	print_space	print_ra
		cp	print_data	key_ascii
		call	print_dec	print_ra
		call	print_newline	print_ra
		be	start		0		0


// E100 keyboard driver

// Function: key_read
// Output: key_pressed, key_ascii

key_read	bne	key_read	0x80000021	num0	// Loop if ps2_response != 0
		cp	0x80000020	num1			// ps2_command = 1
key_read2	bne	key_read2	0x80000021	num1	// Loop if ps2_response != 1
		cp	key_pressed	0x80000022
		cp	key_ascii	0x80000023
		cp	0x80000020	num0
		ret	key_ra

num0	0
num1	1

key_pressed	0
key_ascii	0
key_ra		0

// Function: print_char
// Parameter: print_char_data

print_char	bne	print_char	0x800000a1	print_num0	// Loop if serial_response != 0 (confirm idle mode)
		cp	0x800000a2      print_char_data			// Set command parameters
		cp	0x800000a0	print_num1			// serial_command = 1
print_char2	bne	print_char2	0x800000a1	print_num1	// Loop if serial_response != 1 (wait for response == 1)
		cp	0x800000a0	print_num0			// serial_command = 0
		ret	print_ra

// Function: print_newline

print_newline	cp	print_ra2	print_ra
		cp	print_char_data	print_num10
		call	print_char	print_ra
		cp	print_ra	print_ra2
		ret	print_ra

// Function: print_space

print_space	cp	print_ra2	print_ra
		cp	print_char_data	print_num32
		call	print_char	print_ra
		cp	print_ra	print_ra2
		ret	print_ra


// Function: print_dec
// Parameter: print_data

print_dec	cp	print_ra2	print_ra

		cp	print_base	print_numE9			// base = 10^9
		cp	print_z		print_num0			// z = False

		blt	print_dec2	print_num0	print_data	// if (0 > data){
		be	print_dec2	print_num0	print_data
		cp	print_char_data	print_num45
		call	print_char	print_ra			//	print('-');
		mult	print_data	print_data	print_neg1	//	data *= -1;
									// }

print_dec2	be	print_dec4	print_base	print_num0	// while (base != 0){
		div	print_x		print_data	print_base	//	x = data / base;
		mult	print_y		print_x		print_base	//	y = x * base;
		sub	print_data	print_data	print_y		//	data = data - y;
		div	print_base	print_base	print_num10	//	base /= 10;

		bne	print_dec3	print_base	print_num0	//	if (base == 0)
		cp	print_z		print_num1			//		z = True

print_dec3	add	print_a		print_z		print_x
		be	print_dec2	print_a		print_num0	//	if (z + x != 0){
		cp	print_z		print_num1			//		z = True

		cpfa	print_char_data	print_char_arr	print_x		//		print(char_arr[x]);
		call	print_char	print_ra			//	}
		be	print_dec2	0		0		// }

print_dec4	cp	print_ra	print_ra2
		ret	print_ra

print_num0	0
print_num1	1
print_neg1	-1
print_num4	4
print_num8	8
print_num9	9	// ASCII value for '\t' (TAB)
print_num10	10	// Base 10 and ASCII value for '\n' (NL)
print_num15	15
print_num32	32	// ASCII value for ' ' (SPACE)
print_num45	45	// ASCII value for '-'
print_num48	48	// ASCII value for '0'
print_num120	120	// ASCII value for 'x'
print_numE9	1000000000	// 10^9

// Function arguments
print_ra	0	// return address
print_ra2	0	// other return address
print_char_data	0	// print_char arg
print_data	0	// print_hex arg

// print_hex variables
print_i		0
print_x		0
print_y		0
print_z		0
print_a		0
print_shift	0

print_char_arr	48
		49
		50
		51
		52
		53
		54
		55
		56
		57
		65
		66
		67
		68
		69
		70

// print_dec variables
print_base	0
