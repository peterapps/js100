
start	cp	vga_x1		num0
	cp	vga_x2		WIDTH
	cp	vga_y1		num0
	cp	vga_y2		HEIGHT
	cp	vga_color_write	BLACK
	call	vga_draw_rect	vga_ra			// Draw black screen

	// Create array of colors
	cpta	RED	arr	num0
	cpta	GREEN	arr	num1
	cpta	BLUE	arr	num2
	cpta	CYAN	arr	num3
	cpta	ORANGE	arr	num4

	// Loop through the array and draw the colors
loop	be	end	i	len
	cp	vga_x1	x1
	cp	vga_x2	x2
	cp	vga_y1	y1
	cp	vga_y2	y2
	cpfa	vga_color_write	arr	i
	call	vga_draw_rect	vga_ra
	add	i	i	num1
	add	x1	x1	num100
	add	x2	x2	num100
	be	loop	0	0
	

end	halt

x1	0
y1	0
x2	100
y2	100

num0	0
num1	1
num2	2
num3	3
num4	4
num100	100

arr	0
	0
	0
	0
	0
len	5
i	0

#include ../driver_vga.e
