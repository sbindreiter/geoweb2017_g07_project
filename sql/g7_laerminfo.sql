CREATE TABLE g7_laerminfo (
    g7_li_id integer NOT NULL,
    g7_li_name text,          -- user name
    g7_li_email text,         -- email adresse user
    g7_li_msg text,           -- beschreibung
    g7_li_laermcat character, -- R oder L
    g7_li_privcat integer,    -- 1 = oeffentlich, 2 = halboeffentlich, 3 = privat
    g7_li_date text,          -- datum
    g7_li_geom geometry       -- geometry
);

CREATE SEQUENCE g7_laerm_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE g7_laerm_id_seq OWNED BY g7_laerminfo.g7_li_id ;

ALTER TABLE ONLY g7_laerminfo ALTER COLUMN g7_li_id SET DEFAULT nextval('g7_laerm_id_seq'::regclass);

ALTER TABLE ONLY g7_laerminfo
    ADD CONSTRAINT feedback_pkey PRIMARY KEY (g7_li_id);
