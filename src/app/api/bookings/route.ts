import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { carId, startDate, endDate, pickupLocation, dropoffLocation, notes, totalDays, totalPrice, serviceFee, grandTotal } = body;

    // Validate required fields
    if (!carId || !startDate || !endDate || !totalDays || !totalPrice || !grandTotal) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if car exists and is available
    const car = await prisma.car.findUnique({
      where: { id: carId },
      include: { host: true }
    });

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    if (!car.isAvailable) {
      return NextResponse.json({ error: "Car is not available" }, { status: 400 });
    }

    // Check for booking conflicts
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        carId,
        status: {
          in: ["PENDING", "CONFIRMED", "ACTIVE"]
        },
        OR: [
          {
            startDate: { lte: new Date(endDate) },
            endDate: { gte: new Date(startDate) }
          }
        ]
      }
    });

    if (conflictingBooking) {
      return NextResponse.json({ error: "Car is not available for selected dates" }, { status: 400 });
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice: grandTotal, // Store the grand total
        status: "PENDING",
        pickupLocation: pickupLocation || car.location,
        dropoffLocation: dropoffLocation || car.location,
        notes: notes || "",
        userId: session.user.id,
        carId: carId
      },
      include: {
        car: {
          include: {
            host: true
          }
        },
        user: true
      }
    });

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalPrice: booking.totalPrice,
        status: booking.status,
        car: {
          make: booking.car.make,
          model: booking.car.model,
          year: booking.car.year
        },
        host: {
          name: booking.car.host.name,
          email: booking.car.host.email
        }
      }
    });

  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const carId = searchParams.get("carId");
    const status = searchParams.get("status");

    // Build where clause
    const where: any = {};
    
    if (userId) {
      where.userId = userId;
    }
    
    if (carId) {
      where.carId = carId;
    }
    
    if (status) {
      where.status = status;
    }

    // If no specific filters, get user's own bookings
    if (!userId && !carId) {
      where.userId = session.user.id;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        car: {
          include: {
            host: true,
            images: true
          }
        },
        user: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({ bookings });

  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

