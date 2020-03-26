// VGA monitor driver

// Function: vga_draw_pixel
// Inputs: vga_x1, vga_y1, vga_color_write

vga_draw_pixel		cp	vga_x2		vga_x1
			cp	vga_y2		vga_y1
			cp	vga_ra2		vga_ra
			call	vga_draw_rect	vga_ra
			cp	vga_ra		vga_ra2
			ret	vga_ra

// Function: vga_draw_rect
// Inputs: vga_x1, vga_y1, vga_x2, vga_y2, vga_color_write

vga_draw_rect		bne	vga_draw_rect	0x80000061	vga_num0	// Confirm idle mode
vga_draw_rect2		cp	0x80000063	vga_x1				// Set the command parameters
			cp	0x80000064	vga_y1
			cp	0x80000065	vga_x2
			cp	0x80000066	vga_y2
			cp	0x80000067	vga_color_write
			cp	0x80000062	vga_num1
			cp	0x80000060	vga_num1			// Write 1 to vga_command
vga_draw_rect3		be	vga_draw_rect4	0x80000061	vga_num1	// Break if vga_response == 1
			be	vga_draw_rect3	0		0		// Go to vga_draw_rect_wait
vga_draw_rect4		cp	0x80000060	vga_num0
			ret	vga_ra

// Function: vga_read_pixel
// Inputs: vga_x1, vga_y1
// Output: vga_color_read

vga_read_pixel		bne	vga_read_pixel	0x80000061	vga_num0	// Confirm idle mode
vga_read_pixel2		cp	0x80000063	vga_x1				// Set the command parameters
			cp	0x80000064	vga_y1
			cp	0x80000062	vga_num0
			cp	0x80000060	vga_num1			// Write 1 to vga_command
vga_read_pixel3		be	vga_read_pixel4	0x80000061	vga_num1	// Break if vga_response == 1
			be	vga_read_pixel3	0		0		// Go to vga_read_pixel_wait
vga_read_pixel4		cp	vga_color_read	0x80000068
			cp	0x80000060	vga_num0
			ret	vga_ra
		
// Function: vga_draw_line
// Inputs: vga_x1, vga_y1, vga_x2, vga_y2, vga_color_write, vga_thickness

vga_draw_line		cp	vga_x0		vga_x1
			cp	vga_y0		vga_y1
			cp	vga_endx	vga_x2
			cp	vga_endy	vga_y2
			cp	vga_ra2		vga_ra
			
			// https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm#All_cases
			blt	vga_draw_line_2	vga_x2		vga_x1		// if (x1 < x2){
			be	vga_draw_line_2	vga_x2		vga_x1
			sub	vga_dx		vga_x2		vga_x1		// 	dx = x2 - x1
			cp	vga_sx		vga_num1			//	sx = 1
			be	vga_draw_line_3	0		0		// } else {
vga_draw_line_2		sub	vga_dx		vga_x1		vga_x2		// 	dx = x1 - x2
			cp	vga_sx		vga_neg1			//	sx = -1 }

vga_draw_line_3		blt	vga_draw_line_4	vga_y2		vga_y1		// if (y1 < y2){
			be	vga_draw_line_4	vga_y2		vga_y1
			sub	vga_dy		vga_y1		vga_y2		// 	dy = y1 - y2
			cp	vga_sy		vga_num1			//	sy = 1
			be	vga_draw_line_5	0		0		// } else {
vga_draw_line_4		sub	vga_dy		vga_y2		vga_y1		// 	dy = y2 - y1
			cp	vga_sy		vga_neg1			//	sy = -1 }

vga_draw_line_5		add	vga_err		vga_dx		vga_dy		// err = dx + dy
vga_draw_line_6		sub	vga_x1		vga_x0		vga_thickness	// Plot a little rectangle around (x0, y0)
			add	vga_x2		vga_x0		vga_thickness
			sub	vga_y1		vga_y0		vga_thickness
			add	vga_y2		vga_y0		vga_thickness
			call	vga_draw_rect	vga_ra				// plot(x0, y0)

			bne	vga_draw_line_7	vga_x0		vga_endx	// if (x0 == endx)
			bne	vga_draw_line_7	vga_y0		vga_endy	// 	if (y0 == endy)
			be	vga_draw_line_10	0	0		//		break

vga_draw_line_7		mult	vga_e2		vga_err		vga_num2	// e2 = 2 * err
			
			blt	vga_draw_line_8	vga_e2		vga_dy		// if (e2 >= dy){
			add	vga_err		vga_err		vga_dy		//	err += dy
			add	vga_x0		vga_x0		vga_sx		//	x0 += sx }

vga_draw_line_8		blt	vga_draw_line_9	vga_dx		vga_e2		// if (e2 <= dx){
			add	vga_err		vga_err		vga_dx		//	err += dx
			add	vga_y0		vga_y0		vga_sy		//	y0 += sy }

vga_draw_line_9		be	vga_draw_line_6	0		0		// loop again

vga_draw_line_10	cp	vga_ra		vga_ra2
			ret	vga_ra

// VGA variables
vga_num0	0	// constant
vga_num1	1	// constant
vga_num2	2	// constant
vga_neg1	-1	// constant
vga_ra		0	// return address
vga_ra2		0	// secondary return address (pseudo call stack)

vga_x0		0	// variables for drawing a line
vga_y0		0
vga_endx	0
vga_endy	0
vga_sx		0
vga_sy		0
vga_dx		0
vga_dy		0
vga_e2		0
vga_err		0

// VGA function arguments
vga_x1		0
vga_y1		0
vga_x2		0
vga_y2		0
vga_color_write	0
vga_color_read	0
vga_thickness	1

// VGA screen constants
WIDTH		639
HEIGHT		479

// VGA color constants
RED		0xff0000
GREEN		0xff00
BLUE		0xff
YELLOW		0xffff00
ORANGE		0xffbf00
CYAN		0xffff
BLACK		0x0
WHITE		0xffffff
PINK		0xff968d
SKY		0xcee7f9
SKYSHADED	0xb7d8f9

