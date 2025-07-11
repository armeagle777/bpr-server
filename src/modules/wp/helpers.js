const { TABLE_NAMES } = require("./constants");




const extractData = (row) => {
  const cards = [];
  const data = row?.map((row) => {
    const {
      serial_number,
      issue_date,
      expire_date,
      printed_at,
      card_status,
      transferred_at,
      ...rowData
    } = row;
    if (serial_number) {
      cards.push({
        serial_number,
        issue_date,
        expire_date,
        printed_at,
        card_status,
        transferred_at,
      });
    }
    return rowData;
  });

  return { cards, data: data ?? null };
};

function convertToMysqlDate(dateStr) {
  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`;
}


const getFullInfoBaseQuery = (tablename, emp_id) => {
  switch (tablename) {
    case TABLE_NAMES.FAMILY:
      return `SELECT 
    claims.id as claim_id,
    claims.status as claim_status,
    a.id,
    a.passport_number,
    a.passport_issued,
    a.passport_valid,
    a.citizenship_id,
    a.birthday_day,
    a.birthday_month,
    a.birthday_year,
    a.actual_address as full_address,
    a.status emplyee_status,
    a.first_name_am,
    a.first_name_en,
    a.last_name_am,
    a.last_name_en,
    a.patronymic_am,
    a.patronymic_en,
    a.email,
    a.ssn,
    a.telephone,
    a.gender_id,
    a.created_at AS user_created,
    c.name_am AS country_arm,
    c.name_en AS country_eng, 
    g.path,
    cards.serial_number,
    cards.issue_date as card_issued,
    cards.expire_date as card_valid,
    cards.status as card_status
    
FROM
    eaeu_employee_family_members a
        INNER JOIN
    countries c ON a.citizenship_id = c.id
        INNER JOIN 
    (SELECT 
        *
    FROM
       claims f 
    WHERE
        f.id = (SELECT 
                MAX(t4.id)
            FROM
               claims t4
            WHERE
                f.eaeu_employee_family_member_id = t4.eaeu_employee_family_member_id)) AS claims ON claims.eaeu_employee_family_member_id = a.id
    INNER JOIN 
        claim_files g ON g.claim_id = claims.id
    LEFT JOIN 
        (SELECT 
        *
    FROM
       ms_cards h
    WHERE
       h.id = (SELECT 
                MAX(t5.id)
            FROM
               ms_cards t5
            WHERE
                h.eaeu_employee_family_member_id = t5.eaeu_employee_family_member_id)) AS cards ON cards.eaeu_employee_family_member_id = a.id  
    WHERE a.id = ${emp_id} and g.type = 'photo' and g.active = '1'`;
    case TABLE_NAMES.EMPLOYEE:
      return `SELECT 
    claims.id as claim_id,
    claims.status as claim_status,
    a.id,
    a.passport_number,
    a.passport_issued,
    a.passport_valid,
    a.citizenship_id,
    a.actual_country_id,
    a.birthday_day,
    a.birthday_month,
    a.birthday_year,
    a.full_address,
    a.status emplyee_status,
    b.first_name_am,
    b.first_name_en,
    b.last_name_am,
    b.last_name_en,
    b.patronymic_am,
    b.patronymic_en,
    b.email,
    b.ssn,
    b.telephone,
    b.email_verified_at,
    b.last_active_at,
    b.gender_id,
    b.created_at AS user_created,
    c.name_am AS country_arm,
    c.name_en AS country_eng, 
    g.path,
    cards.serial_number,
    cards.issue_date as card_issued,
    cards.expire_date as card_valid,
    cards.status as card_status
    
FROM
    employees a
        INNER JOIN
    users b ON a.user_id = b.id
        INNER JOIN
    countries c ON a.citizenship_id = c.id
        INNER JOIN 
    (SELECT 
        *
    FROM
       claims f
    WHERE
        f.id = (SELECT 
                MAX(t4.id)
            FROM
               claims t4
            WHERE
                f.employee_id = t4.employee_id)) AS claims ON claims.employee_id = a.id
    INNER JOIN 
        claim_files g ON g.claim_id = claims.id
    LEFT JOIN 
        (SELECT 
        *
    FROM
       ms_cards h
    WHERE
       h.id = (SELECT 
                MAX(t5.id)
            FROM
               ms_cards t5
            WHERE
                h.employee_id = t5.employee_id)) AS cards ON cards.employee_id = a.id 
      where a.id = ${emp_id} and g.type = 'photo' and g.active = '1'`;
    case TABLE_NAMES.EAEU:
      return `SELECT 
    claims.id as claim_id,
    claims.status as claim_status,
    a.id,
    a.passport_number,
    a.passport_issued,
    a.passport_valid,
    a.citizenship_id,
    a.birthday_day,
    a.birthday_month,
    a.birthday_year,
    a.actual_address as full_address,
    a.status emplyee_status,
    b.first_name_am,
    b.first_name_en,
    b.last_name_am,
    b.last_name_en,
    b.patronymic_am,
    b.patronymic_en,
    b.email,
    b.ssn,
    b.telephone,
    b.email_verified_at,
    b.last_active_at,
    b.gender_id,
    b.created_at AS user_created,
    c.name_am AS country_arm,
    c.name_en AS country_eng, 
    g.path,
    cards.serial_number,
    cards.issue_date as card_issued,
    cards.expire_date as card_valid,
    cards.status as card_status
    
FROM
    eaeu_employees a
        INNER JOIN
    users b ON a.user_id = b.id
        INNER JOIN
    countries c ON a.citizenship_id = c.id
        INNER JOIN 
    (SELECT 
        *
    FROM
       claims f
    WHERE
        f.id = (SELECT 
                MAX(t4.id)
            FROM
               claims t4
            WHERE
                f.eaeu_employee_id = t4.eaeu_employee_id)) AS claims ON claims.eaeu_employee_id = a.id
    INNER JOIN 
        claim_files g ON g.claim_id = claims.id
    LEFT JOIN 
        (SELECT 
        *
    FROM
       ms_cards h
    WHERE
       h.id = (SELECT 
                MAX(t5.id)
            FROM
               ms_cards t5
            WHERE
                h.eaeu_employee_id = t5.eaeu_employee_id)) AS cards ON cards.eaeu_employee_id = a.id
    where a.id = ${emp_id} and g.type = 'photo' and g.active = '1'`;
    default:
      return "";
  }
};

const getFinesQuery = (tableName, emp_id) => {
  switch (tableName) {
    case TABLE_NAMES.FAMILY:
      return `SELECT a.claim_id, a.employee_id, a.eaeu_employee_id, 
                      a.eaeu_employee_family_member_id, a.status, 
                      a.created_at as notify_date, b.created_at as fined_date
               FROM fines a 
               left join fine_logs b on b.fine_id = a.id 
               where eaeu_employee_family_member_id = ${emp_id}`;
    case TABLE_NAMES.EMPLOYEE:
      return `SELECT a.claim_id, a.employee_id, a.eaeu_employee_id, 
                      a.eaeu_employee_family_member_id, a.status, 
                      a.created_at as notify_date, b.created_at as fined_date
               FROM fines a 
               left join fine_logs b on b.fine_id = a.id 
               where employee_id = ${emp_id}`;
    case TABLE_NAMES.EAEU:
      return `SELECT a.claim_id, a.employee_id, a.eaeu_employee_id, 
                      a.eaeu_employee_family_member_id, a.status, 
                      a.created_at as notify_date, b.created_at as fined_date
               FROM fines a 
               left join fine_logs b on b.fine_id = a.id 
               where eaeu_employee_id = ${emp_id}`;
    default:
      return "";
  }
};

const getClaimsQuery = (tableName, emp_id) => {
  switch (tableName) {
    case TABLE_NAMES.FAMILY:
      return `SELECT 
          a.id,
          a.eaeu_employee_family_member_id,
          a.created_at,
          a.status,
          a.type,
          c.first_name_am as officer_name,
          c.last_name_am as officer_last_name,
          log.action,
          log.created_at as log_created_at,
          log.send_number
      FROM
          claims a
              LEFT JOIN
          ms_employees b ON a.ms_employee_id = b.id
              LEFT JOIN
          users c ON b.user_id = c.id
              LEFT JOIN
          (SELECT 
              *
          FROM
              ms_logs
          WHERE
              type = 6) AS log ON log.claim_id = a.id
      WHERE a.eaeu_employee_family_member_id = ${emp_id}`;
    case TABLE_NAMES.EMPLOYEE:
      return `SELECT 
            a.id,
            a.employee_id,
            a.created_at,
            a.status,
            a.type,
            c.first_name_am as officer_name,
            c.last_name_am as officer_last_name,
            log.action,
            log.created_at as log_created_at,
            log.send_number
        FROM
            claims a
                LEFT JOIN
            ms_employees b ON a.ms_employee_id = b.id
                LEFT JOIN
            users c ON b.user_id = c.id
                LEFT JOIN
            (SELECT 
                *
            FROM
                ms_logs
            WHERE
                type = 6) AS log ON log.claim_id = a.id
         WHERE a.employee_id = ${emp_id}`;
    case TABLE_NAMES.EAEU:
      return `SELECT 
        a.id,
        a.eaeu_employee_id,
        a.created_at,
        a.status,
        a.type,
        c.first_name_am as officer_name,
        c.last_name_am as officer_last_name,
        log.action,
        log.created_at as log_created_at,
        log.send_number
    FROM
        claims a
            LEFT JOIN
        ms_employees b ON a.ms_employee_id = b.id
            LEFT JOIN
        users c ON b.user_id = c.id
            LEFT JOIN
        (SELECT 
            *
        FROM
            ms_logs
        WHERE
            type = 6) AS log ON log.claim_id = a.id
     WHERE a.eaeu_employee_id = ${emp_id}`;
    default:
      return "";
  }
};

const getCardsQuery = (tableName, emp_id) => {
  switch (tableName) {
    case TABLE_NAMES.FAMILY:
      return `SELECT * FROM ms_cards  WHERE eaeu_employee_family_member_id = ${emp_id}`;
    case TABLE_NAMES.EMPLOYEE:
      return `SELECT * FROM ms_cards  WHERE employee_id = ${emp_id}`;
    case TABLE_NAMES.EAEU:
      return `SELECT * FROM ms_cards  WHERE eaeu_employee_id = ${emp_id}`;
    default:
      return "";
  }
};

const getFamilyMemberQuery = (tableName, user_id) => {
  switch (tableName) {
    case TABLE_NAMES.EAEU:
      return `SELECT 
            a.id,
            a.user_id,
            a.first_name_en,
            a.last_name_en,
            a.passport_number,
            a.citizenship_id,
            a.ssn,
            a.family_member_id,
            c.alpha_3,
            c.arm_short,
            b.id AS claim_id,
            b.type AS claim_type,
            b.status AS claim_status,
            cards.serial_number,
            cards.issue_date as card_issued,
            cards.expire_date as card_valid,
            cards.status as card_status
        FROM
            eaeu_employee_family_members a
                INNER JOIN
            claims b ON a.id = b.eaeu_employee_family_member_id
                INNER JOIN
            countries c ON a.citizenship_id = c.id
                LEFT JOIN
            ms_cards cards ON cards.claim_id = b.id
        WHERE a.user_id = ${user_id}`;
    default:
      return "";
  }
};

const formatBaseResult = (result) => {
  if (!result) return null;
  const data = result[0];

  if (data.path) {
    data.path = `${process.env.WP_IMAGE_SERVER_URL}${data.path}`;
  }
  if (data.gender_id) {
    data.genderText =
      data.gender_id === 1 ? "արական / male" : "իգական / female";
  }
  return data;
};

const fetchWpData = async () =>{
  // Modify to fetch data from Migration Service
  return null
}

module.exports = {
  extractData,
  getFullInfoBaseQuery,
  getFinesQuery,
  formatBaseResult,
  getClaimsQuery,
  getCardsQuery,
  getFamilyMemberQuery,
  fetchWpData
};
