export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  const API_KEY = process.env.API_TOKEN_ACTIVECAMPAIGN;
  const API_URL = process.env.ACTIVECAMPAIGN_API;

  try {
    const response = await fetch(`${API_URL}?email=${email}`, {
      headers: { "Api-Token": API_KEY },
    });

    const data = await response.json();

    if (data.contacts && data.contacts.length > 0) {
      const contact = data.contacts[0];
      return Response.json({
        nombre: `${contact.firstName} ${contact.lastName}` || "Nombre no disponible",
        celular: contact.phone || "Teléfono no disponible",
      });
    } else {
      return new Response(JSON.stringify({ message: "No se encuentra el alumno." }), { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Error al conectar con la API." }), { status: 500 });
  }
}
