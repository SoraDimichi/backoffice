CREATE OR REPLACE FUNCTION public.generate_random_transactions(
    p_user_id UUID,
    p_count INT
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_i           INT;
    v_created_at  TIMESTAMP;
    v_updated_at  TIMESTAMP;
    v_type        public.transaction_type;
    v_subtype     public.transaction_subtype;
    v_status      public.transaction_status;
BEGIN
    FOR v_i IN 1..p_count LOOP
        v_created_at := now() - (random() * 5 * 7) * INTERVAL '1 day';
        v_updated_at := v_created_at + random() * (now() - v_created_at);

        IF random() < 0.5 THEN
            v_type := 'deposit';
        ELSE
            v_type := 'credit';
        END IF;

        SELECT value
        INTO v_subtype
        FROM (
            VALUES
                ('refund'::public.transaction_subtype),
                ('reward'::public.transaction_subtype),
                ('purchase'::public.transaction_subtype)
        ) AS t(value)
        ORDER BY random()
        LIMIT 1;

        SELECT value
        INTO v_status
        FROM (
            VALUES
                ('pending'::public.transaction_status),
                ('completed'::public.transaction_status),
                ('failed'::public.transaction_status)
        ) AS t(value)
        ORDER BY random()
        LIMIT 1;

        INSERT INTO public.transactions (
            id,
            user_id,
            description,
            type,
            subtype,
            amount,
            status,
            created_at,
            updated_at
        )
        VALUES (
            gen_random_uuid(),
            p_user_id,
            'Random transaction #' || v_i,
            v_type,
            v_subtype,
            ROUND(random() * 10000)::NUMERIC / 100,
            v_status,
            v_created_at,
            v_updated_at
        );
    END LOOP;

END;
$$;

SELECT public.generate_random_transactions(
  (SELECT public.create_user_internal(
    email := 'admin@admin.com',
    password := 'qwertqwert',
    role := 'admin'::public.app_role,
    first_name := 'Admin',
    last_name := 'User'
)),
  200
);

SELECT public.generate_random_transactions(
  (SELECT public.create_user_internal(
    email := 'user@user.com',
    password := 'qwertqwert',
    role := 'user'::public.app_role,
    first_name := 'Regular',
    last_name := 'User'
)),
  200
);

