export async function onRequestPost({ request, env }) {
  try {
    const form = await request.json();

    const frequencyMap = {
      "1": "once_a_week",
      "2": "bi_weekly",
      "3": "one_time"
    };

    const payload = {
      zip_code: form.zipCode,
      number_of_dogs: Number(form.dogCount),
      clean_up_frequency: frequencyMap[form.frequency],
      initial_cleanup_required: 0,
      last_time_yard_was_thoroughly_cleaned: "one_week",

      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      city: form.city,
      home_address: form.address,
      state: "CA",

      home_phone_number: form.phone,
      cell_phone_number: form.phone,

      cleanup_notification_type: "on_the_way,completed",
      cleanup_notification_channel: "sms",

      additional_comment: form.notes || "",
      marketing_allowed: form.privacyConsent ? 1 : 0,
      marketing_allowed_source: "desertscoops.com",
      terms_open_api: 1
    };

    const response = await fetch(
      "https://openapi.sweepandgo.com/api/v1/residential/onboarding",
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${env.SWEEPGO_API_KEY}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: "Sweep&Go rejected the request", details: data },
        { status: 400 }
      );
    }

    return Response.json({ success: true, data });
  } catch (error) {
    return Response.json(
      { error: "Server error", message: error.message },
      { status: 500 }
    );
  }
}
