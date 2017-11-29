CREATE TABLE g7_laerminfo (
    g7_li_id integer NOT NULL,
    g7_li_name text,
    g7_li_email text,
    g7_li_msg text,
    g7_li_laermcat character,
    g7_li_privcat integer,
    g7_li_date text,
    g7_li_geom geometry
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